import { Rule } from "eslint";
import { baselineCheck, BaselineStatus } from "./baseline";
import { parseJavaScript } from "./parsers";

interface CodeSenseESLintOptions {
    baselineLevel?: 'widely' | 'newly' | 'all';
    ignorePatterns?: string[];
    reportUnknown?: boolean;
}

const baselineRule: Rule.RuleModule = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce Baseline web compatibility standards",
            category: "Best Practices",
            recommended: true,
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    baselineLevel: {
                        type: "string",
                        enum: ["widely", "newly", "all"],
                        default: "newly"
                    },
                    ignorePatterns: {
                        type: "array",
                        items: { type: "string" },
                        default: []
                    },
                    reportUnknown: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            limitedSupport: "{{api}} has limited browser support (❌ Limited). Consider using a polyfill or alternative.",
            newlyAvailable: "{{api}} is newly available (⚠️ Newly available). Monitor for wider adoption.",
            unknownSupport: "{{api}} has unknown baseline status (❓ Unknown). Verify browser support manually.",
            polyfillSuggestion: "Consider using {{polyfill}} polyfill for {{api}}.",
            alternativeSuggestion: "Consider using {{alternative}} instead of {{api}}."
        }
    },

    create(context: Rule.RuleContext): Rule.RuleListener {
        const options: CodeSenseESLintOptions = context.options[0] || {};
        const baselineLevel = options.baselineLevel || 'newly';
        const ignorePatterns = options.ignorePatterns || [];
        const reportUnknown = options.reportUnknown || false;

        const checkedAPIs = new Map<string, BaselineStatus>();

        async function checkAPI(api: string, node: any) {
            // Skip if API matches ignore patterns
            if (ignorePatterns.some(pattern => new RegExp(pattern).test(api))) {
                return;
            }

            // Use cached result if available
            if (checkedAPIs.has(api)) {
                reportIssue(api, checkedAPIs.get(api)!, node);
                return;
            }

            try {
                const status = await baselineCheck(api);
                checkedAPIs.set(api, status);
                reportIssue(api, status, node);
            } catch (error) {
                // Silently fail for async checks in ESLint
            }
        }

        function reportIssue(api: string, status: BaselineStatus, node: any) {
            const shouldReport = getShouldReport(status, baselineLevel, reportUnknown);
            
            if (!shouldReport) {return;}

            const messageId = getMessageId(status);
            const data = { api };

            context.report({
                node,
                messageId,
                data,
                suggest: getSuggestions(api, status)
            });
        }

        function getShouldReport(status: BaselineStatus, level: string, reportUnknown: boolean): boolean {
            if (status === "❌ Limited") {return true;}
            if (status === "⚠️ Newly available" && level !== 'widely') {return true;}
            if (status === "❓ Unknown" && reportUnknown) {return true;}
            return false;
        }

        function getMessageId(status: BaselineStatus): string {
            switch (status) {
                case "❌ Limited": return "limitedSupport";
                case "⚠️ Newly available": return "newlyAvailable";
                case "❓ Unknown": return "unknownSupport";
                default: return "limitedSupport";
            }
        }

        function getSuggestions(api: string, status: BaselineStatus): Rule.SuggestionReportDescriptor[] {
            const suggestions: Rule.SuggestionReportDescriptor[] = [];

            // Add polyfill suggestions for limited support APIs
            if (status === "❌ Limited") {
                const polyfill = getPolyfillSuggestion(api);
                if (polyfill) {
                    suggestions.push({
                        messageId: "polyfillSuggestion",
                        data: { api, polyfill },
                        fix: (fixer) => {
                            // This would add import for polyfill
                            return fixer.insertTextBefore(
                                context.getSourceCode().ast,
                                `import '${polyfill}';\n`
                            );
                        }
                    });
                }

                const alternative = getAlternativeSuggestion(api);
                if (alternative) {
                    suggestions.push({
                        messageId: "alternativeSuggestion",
                        data: { api, alternative },
                        fix: null // Manual fix required
                    });
                }
            }

            return suggestions;
        }

        function getPolyfillSuggestion(api: string): string | null {
            const polyfills: Record<string, string> = {
                'fetch': 'whatwg-fetch',
                'promise': 'es6-promise',
                'intersection-observer': 'intersection-observer',
                'resize-observer': 'resize-observer-polyfill'
            };

            return polyfills[api.toLowerCase()] || null;
        }

        function getAlternativeSuggestion(api: string): string | null {
            const alternatives: Record<string, string> = {
                'fetch': 'XMLHttpRequest',
                'intersection-observer': 'scroll event listeners',
                'resize-observer': 'window.resize event'
            };

            return alternatives[api.toLowerCase()] || null;
        }

        return {
            // Check member expressions (e.g., navigator.clipboard, window.fetch)
            MemberExpression(node) {
                if (node.object.type === 'Identifier' && node.property.type === 'Identifier') {
                    const objectName = node.object.name;
                    const propertyName = node.property.name;
                    
                    if (['navigator', 'window'].includes(objectName)) {
                        const api = `${objectName}-${propertyName}`;
                        checkAPI(api, node);
                    }
                }
            },

            // Check function calls (e.g., fetch(), requestAnimationFrame())
            CallExpression(node) {
                if (node.callee.type === 'Identifier') {
                    const functionName = node.callee.name;
                    const webAPIs = [
                        'fetch', 'requestAnimationFrame', 'cancelAnimationFrame',
                        'requestIdleCallback', 'cancelIdleCallback'
                    ];
                    
                    if (webAPIs.includes(functionName)) {
                        checkAPI(functionName, node);
                    }
                }
            },

            // Check constructor calls (e.g., new IntersectionObserver())
            NewExpression(node) {
                if (node.callee.type === 'Identifier') {
                    const constructorName = node.callee.name;
                    const webAPIConstructors = [
                        'IntersectionObserver', 'ResizeObserver', 'MutationObserver',
                        'PerformanceObserver', 'BroadcastChannel', 'MessageChannel',
                        'Worker', 'ServiceWorker', 'WebSocket', 'EventSource'
                    ];
                    
                    if (webAPIConstructors.includes(constructorName)) {
                        checkAPI(constructorName.toLowerCase(), node);
                    }
                }
            }
        };
    }
};

// ESLint plugin export
const CodeSenseESLintPlugin = {
    rules: {
        'baseline-compatibility': baselineRule
    },
    configs: {
        recommended: {
            plugins: ['CodeSense'],
            rules: {
                'CodeSense/baseline-compatibility': ['error', {
                    baselineLevel: 'newly',
                    reportUnknown: false
                }]
            }
        },
        strict: {
            plugins: ['CodeSense'],
            rules: {
                'CodeSense/baseline-compatibility': ['error', {
                    baselineLevel: 'widely',
                    reportUnknown: true
                }]
            }
        }
    }
};

export default CodeSenseESLintPlugin;

// For CommonJS compatibility
module.exports = CodeSenseESLintPlugin;