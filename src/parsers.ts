import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import postcss, { Rule, Declaration, AtRule } from "postcss";
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

export interface ParsedFeature {
    api: string;
    line?: number;
    column?: number;
    context?: string;
}

// JavaScript/TypeScript Parser
export async function parseJavaScript(content: string, filePath: string): Promise<ParsedFeature[]> {
    const features: ParsedFeature[] = [];
    
    try {
        const ast = parse(content, {
            sourceType: "module",
            allowImportExportEverywhere: true,
            allowReturnOutsideFunction: true,
            plugins: [
                "jsx",
                "typescript",
                "decorators-legacy",
                "classProperties",
                "objectRestSpread",
                "asyncGenerators",
                "functionBind",
                "exportDefaultFrom",
                "exportNamespaceFrom",
                "dynamicImport",
                "nullishCoalescingOperator",
                "optionalChaining"
            ]
        });

        traverse(ast, {
            // Web APIs
            MemberExpression(path: NodePath<t.MemberExpression>) {
                const { node } = path;
                const memberExpr = getMemberExpressionString(node);
                
                // Navigator APIs
                if (memberExpr.startsWith('navigator.')) {
                    const api = memberExpr.replace('navigator.', '');
                    features.push({
                        api: `navigator-${api}`,
                        line: node.loc?.start.line,
                        column: node.loc?.start.column,
                        context: memberExpr
                    });
                }
                
                // Window APIs
                if (memberExpr.startsWith('window.') || isGlobalAPI(memberExpr)) {
                    features.push({
                        api: memberExpr.replace('window.', ''),
                        line: node.loc?.start.line,
                        column: node.loc?.start.column,
                        context: memberExpr
                    });
                } else if (t.isIdentifier(node.object) && isGlobalAPI(node.object.name)) {
                    features.push({
                        api: node.object.name,
                        line: node.loc?.start.line,
                        column: node.loc?.start.column,
                        context: memberExpr
                    });
                }
            },

            // Function calls
            CallExpression(path: NodePath<t.CallExpression>) {
                const { node } = path;
                const callee = getCalleeString(node.callee);
                
                if (isWebAPI(callee)) {
                    features.push({
                        api: callee,
                        line: node.loc?.start.line,
                        column: node.loc?.start.column,
                        context: `${callee}()`
                    });
                }
            },

            // New expressions (constructors)
            NewExpression(path: NodePath<t.NewExpression>) {
                const { node } = path;
                const constructor = getCalleeString(node.callee);
                
                if (isWebAPIConstructor(constructor)) {
                    features.push({
                        api: constructor.toLowerCase(),
                        line: node.loc?.start.line,
                        column: node.loc?.start.column,
                        context: `new ${constructor}()`
                    });
                }
            }
        });

    } catch (error) {
        console.warn(`Failed to parse JavaScript in ${filePath}:`, error);
    }

    return features;
}

// CSS Parser
export async function parseCSS(content: string, filePath: string): Promise<ParsedFeature[]> {
    const features: ParsedFeature[] = [];
    
    try {
        const root = postcss.parse(content, { from: filePath });
        
        try {
            root.walkRules((rule: Rule) => {
                // Parse selectors
                try {
                    const processor = selectorParser((selectors: any) => {
                        selectors.walkPseudos((pseudo: any) => {
                            if (pseudo.value.startsWith(':')) {
                                features.push({
                                    api: `css-pseudo-${pseudo.value.slice(1)}`,
                                    line: rule.source?.start?.line,
                                    column: rule.source?.start?.column,
                                    context: pseudo.value
                                });
                            }
                        });
                    });
                    processor.processSync(rule.selector);
                } catch (e) {
                    // Ignore selector parsing errors
                }
            });
        } catch (e) {
            console.warn(`Failed to walk CSS rules in ${filePath}:`, e);
        }

        try {
            root.walkDecls((decl: Declaration) => {
                // CSS Properties
                features.push({
                    api: `css-property-${decl.prop}`,
                    line: decl.source?.start?.line,
                    column: decl.source?.start?.column,
                    context: `${decl.prop}: ${decl.value}`
                });

                // CSS Values
                try {
                    const parsed = valueParser(decl.value);
                    parsed.walk((node: any) => {
                        if (node.type === 'function') {
                            features.push({
                                api: `css-function-${node.value}`,
                                line: decl.source?.start?.line,
                                column: decl.source?.start?.column,
                                context: `${node.value}()`
                            });
                        }
                    });
                } catch (e) {
                    // Ignore value parsing errors
                }
            });
        } catch (e) {
            console.warn(`Failed to walk CSS declarations in ${filePath}:`, e);
        }

        try {
            root.walkAtRules((atRule: AtRule) => {
                features.push({
                    api: `css-at-rule-${atRule.name}`,
                    line: atRule.source?.start?.line,
                    column: atRule.source?.start?.column,
                    context: `@${atRule.name}`
                });
            });
        } catch (e) {
            console.warn(`Failed to walk CSS at-rules in ${filePath}:`, e);
        }

    } catch (error) {
        console.warn(`Failed to parse CSS in ${filePath}:`, error);
    }

    return features;
}

// HTML Parser
export async function parseHTML(content: string, filePath: string): Promise<ParsedFeature[]> {
    const features: ParsedFeature[] = [];
    
    try {
        // Simple regex-based HTML parsing for now
        // In production, you'd want to use a proper HTML parser like parse5
        
        // HTML elements
        const elementRegex = /<(\w+)(?:\s[^>]*)?>/g;
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let elementMatch;
            
            while ((elementMatch = elementRegex.exec(line)) !== null) {
                const tagName = elementMatch[1].toLowerCase();
                
                if (isModernHTMLElement(tagName)) {
                    features.push({
                        api: `html-element-${tagName}`,
                        line: i + 1,
                        column: elementMatch.index,
                        context: `<${tagName}>`
                    });
                }
            }
        }

        // HTML attributes
        const attributeRegex = /([\w-]+)(?:=(?:["'][^"']*["']|[^>\s]+))?/g;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let attrMatch;
            
            while ((attrMatch = attributeRegex.exec(line)) !== null) {
                const attrName = attrMatch[1].toLowerCase();
                
                if (isModernHTMLAttribute(attrName)) {
                    features.push({
                        api: `html-attribute-${attrName}`,
                        line: i + 1,
                        column: attrMatch.index,
                        context: attrMatch[0]
                    });
                }
            }
        }

    } catch (error) {
        console.warn(`Failed to parse HTML in ${filePath}:`, error);
    }

    return features;
}

// Helper functions
function getMemberExpressionString(node: t.MemberExpression): string {
    if (t.isIdentifier(node.object) && t.isIdentifier(node.property)) {
        return `${node.object.name}.${node.property.name}`;
    }
    if (t.isMemberExpression(node.object) && t.isIdentifier(node.property)) {
        return `${getMemberExpressionString(node.object)}.${node.property.name}`;
    }
    if (t.isIdentifier(node.object)) {
        return node.object.name;
    }
    return '';
}

function getCalleeString(callee: t.Expression | t.V8IntrinsicIdentifier): string {
    if (t.isIdentifier(callee)) {
        return callee.name;
    }
    if (t.isMemberExpression(callee)) {
        return getMemberExpressionString(callee);
    }
    // V8IntrinsicIdentifier is not a web API, so return empty string
    return '';
}

function isGlobalAPI(name: string): boolean {
    const globalAPIs = [
        'fetch', 'localStorage', 'sessionStorage', 'indexedDB',
        'crypto', 'performance', 'requestAnimationFrame',
        'IntersectionObserver', 'ResizeObserver', 'MutationObserver'
    ];
    return globalAPIs.includes(name);
}

function isWebAPI(name: string): boolean {
    const webAPIs = [
        'fetch', 'requestAnimationFrame', 'cancelAnimationFrame',
        'requestIdleCallback', 'cancelIdleCallback',
        'addEventListener', 'removeEventListener'
    ];
    return webAPIs.includes(name) || name.startsWith('navigator.') || name.startsWith('window.');
}

function isWebAPIConstructor(name: string): boolean {
    const constructors = [
        'IntersectionObserver', 'ResizeObserver', 'MutationObserver',
        'PerformanceObserver', 'ReportingObserver', 'BroadcastChannel',
        'MessageChannel', 'Worker', 'ServiceWorker', 'SharedWorker',
        'WebSocket', 'EventSource', 'AbortController'
    ];
    return constructors.includes(name);
}

function isModernHTMLElement(tagName: string): boolean {
    const modernElements = [
        'dialog', 'details', 'summary', 'progress', 'meter',
        'time', 'mark', 'wbr', 'ruby', 'rt', 'rp',
        'canvas', 'svg', 'video', 'audio', 'source', 'track',
        'picture', 'template', 'slot'
    ];
    return modernElements.includes(tagName);
}

function isModernHTMLAttribute(attrName: string): boolean {
    const modernAttributes = [
        'contenteditable', 'draggable', 'dropzone', 'hidden',
        'spellcheck', 'translate', 'role', 'aria-*',
        'data-*', 'loading', 'decoding', 'fetchpriority'
    ];
    return modernAttributes.includes(attrName) || 
           attrName.startsWith('aria-') || 
           attrName.startsWith('data-');
}
