import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Toast from '../components/Toast';
import api from '../services/api';

export default function TechnicalChallenge() {
        const navigate = useNavigate();
        const location = useLocation();
        const resultsRef = useRef(null);

        const [problem, setProblem] = useState(location.state?.problem || null);
        const [promptText, setPromptText] = useState('');
        const [wordCount, setWordCount] = useState(0);
        const [charCount, setCharCount] = useState(0);
        const [tokenCount, setTokenCount] = useState(0);
        const [isEvaluating, setIsEvaluating] = useState(false);
        const [evaluationResults, setEvaluationResults] = useState(null);
        const [showResults, setShowResults] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        const updateCounters = (text) => {
                const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
                const chars = text.length;
                const tokens = Math.ceil(chars / 4);

                setWordCount(words);
                setCharCount(chars);
                setTokenCount(tokens);
        };

        const handlePromptChange = (e) => {
                const text = e.target.value;
                setPromptText(text);
                updateCounters(text);
        };

        const handleEvaluate = async () => {
                if (!promptText.trim()) {
                        setToast({ message: 'Please write a prompt first!', type: 'error', visible: true });
                        return;
                }

                setIsEvaluating(true);
                try {
                        // ✅ FIXED: Added /api prefix
                        const response = await api.post('/api/technical-evaluate', {
                                problem,
                                user_prompt: promptText,
                                constraints: {},
                        });
                        setEvaluationResults(response.data);
                        setShowResults(true);
                        setToast({ message: 'Evaluation complete! 🎉', type: 'success', visible: true });

                        setTimeout(() => {
                                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                } catch (error) {
                        console.error('Technical evaluation error:', error);

                        let errorMessage = 'Evaluation failed. Please try again.';
                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') {
                                        errorMessage = error.response.data.detail;
                                }
                        }

                        setToast({
                                message: errorMessage,
                                type: 'error',
                                visible: true,
                        });
                } finally {
                        setIsEvaluating(false);
                }
        };


        const handleNewChallenge = () => {
                navigate('/technical-challenge-selector');
        };

        if (!problem) {
                return (
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <Card className="p-8 text-center max-w-md">
                                                <div className="text-6xl mb-4">💻</div>
                                                <h2 className="text-2xl font-bold mb-2">No Challenge Selected</h2>
                                                <p className="text-text-secondary mb-6">Choose a challenge category and difficulty to get started.</p>
                                                <Button onClick={handleNewChallenge}>Select Challenge</Button>
                                        </Card>
                                </main>
                        </div>
                );
        }

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64">
                                {/* Header */}
                                <header className="bg-bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
                                        <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between">
                                                <nav className="flex items-center gap-2 text-sm text-text-secondary">
                                                        <span>Home</span> <span>/</span>
                                                        <span>Technical Challenge</span> <span>/</span>
                                                        <span className="text-text-primary font-semibold">
                                                                {problem.category} - {problem.difficulty}
                                                        </span>
                                                </nav>
                                                <Button onClick={handleNewChallenge} variant="secondary">
                                                        🔄 New Challenge
                                                </Button>
                                        </div>
                                </header>

                                {/* Main Content */}
                                <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Problem Card */}
                                        <Card className="p-6 h-fit sticky top-24">
                                                <div className="flex items-center gap-3 mb-4">
                                                        <h2 className="text-2xl font-bold">Problem Statement</h2>
                                                        <Badge variant={problem.category?.toLowerCase()}>{problem.category}</Badge>
                                                        <Badge variant="default">{problem.difficulty}</Badge>
                                                </div>

                                                <h3 className="text-xl font-bold text-primary mb-4">{problem.title}</h3>

                                                {problem.tags && (
                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                                {problem.tags.map((tag, index) => (
                                                                        <span
                                                                                key={index}
                                                                                className="px-3 py-1 text-xs bg-bg-input border border-border rounded-full text-text-secondary"
                                                                        >
                                                                                {tag}
                                                                        </span>
                                                                ))}
                                                        </div>
                                                )}

                                                <div className="space-y-6">
                                                        <div>
                                                                <h4 className="font-semibold mb-2 text-accent-cyan">Description</h4>
                                                                <p className="text-text-secondary leading-relaxed">{problem.description || problem.problem_statement}</p>
                                                        </div>

                                                        {problem.examples && (
                                                                <div>
                                                                        <h4 className="font-semibold mb-3 text-accent-cyan">Examples</h4>
                                                                        <div className="space-y-4">
                                                                                {problem.examples.map((example, index) => (
                                                                                        <div key={index} className="bg-bg-dark/50 border border-border rounded-lg p-4 font-mono text-sm">
                                                                                                <div className="mb-2">
                                                                                                        <span className="text-success">Input:</span>
                                                                                                        <span className="text-text-primary ml-2">{example.input}</span>
                                                                                                </div>
                                                                                                <div className="mb-2">
                                                                                                        <span className="text-warning">Output:</span>
                                                                                                        <span className="text-text-primary ml-2">{example.output}</span>
                                                                                                </div>
                                                                                                {example.explanation && (
                                                                                                        <div className="text-text-secondary text-xs mt-2">{example.explanation}</div>
                                                                                                )}
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {problem.constraints && (
                                                                <div>
                                                                        <h4 className="font-semibold mb-2 text-accent-cyan">Constraints</h4>
                                                                        <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
                                                                                {problem.constraints.map((constraint, index) => (
                                                                                        <li key={index}>{constraint}</li>
                                                                                ))}
                                                                        </ul>
                                                                </div>
                                                        )}

                                                        {problem.hints && (
                                                                <div>
                                                                        <h4 className="font-semibold mb-2 text-accent-pink">Hints</h4>
                                                                        <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
                                                                                {problem.hints.map((hint, index) => (
                                                                                        <li key={index}>{hint}</li>
                                                                                ))}
                                                                        </ul>
                                                                </div>
                                                        )}
                                                </div>
                                        </Card>

                                        {/* Editor Card */}
                                        <div className="space-y-6">
                                                <Card className="p-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                                <h2 className="text-2xl font-bold">Craft Your Prompt</h2>
                                                                <span className="text-sm text-text-secondary">Write your solution approach</span>
                                                        </div>

                                                        <textarea
                                                                className="w-full min-h-[400px] p-4 bg-bg-input border border-border rounded-lg text-text-primary font-mono text-sm resize-y focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                                                placeholder="Example:
Write a function that solves [problem name]. 
- Use [data structure/algorithm]
- Handle edge cases like [...]
- Time complexity should be O(...)
- Consider constraints: [...]"
                                                                value={promptText}
                                                                onChange={handlePromptChange}
                                                        />

                                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                                                <div className="flex gap-6 text-sm">
                                                                        <div>
                                                                                <span className="text-text-secondary">Words:</span>
                                                                                <span className="ml-2 font-semibold text-primary">{wordCount}</span>
                                                                        </div>
                                                                        <div>
                                                                                <span className="text-text-secondary">Characters:</span>
                                                                                <span className="ml-2 font-semibold text-accent-cyan">{charCount}</span>
                                                                        </div>
                                                                        <div>
                                                                                <span className="text-text-secondary">Est. Tokens:</span>
                                                                                <span className="ml-2 font-semibold text-accent-pink">{tokenCount}</span>
                                                                        </div>
                                                                </div>
                                                                <Button onClick={handleEvaluate} isLoading={isEvaluating}>
                                                                        {isEvaluating ? 'Evaluating...' : '✨ Evaluate Prompt'}
                                                                </Button>
                                                        </div>
                                                </Card>

                                                {/* Evaluation Results */}
                                                {showResults && evaluationResults && (
                                                        <Card className="p-6 animate-slide-up" ref={resultsRef}>
                                                                <h2 className="text-2xl font-bold mb-6">Evaluation Results</h2>

                                                                {/* Overall Score */}
                                                                <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-accent-cyan/10 border border-primary/30 rounded-xl">
                                                                        <div className="flex items-center justify-between">
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-text-secondary mb-1">Overall Score</h3>
                                                                                        <div className="text-5xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
                                                                                                {evaluationResults.overall_score}/100
                                                                                        </div>
                                                                                </div>
                                                                                <div className="text-6xl">
                                                                                        {evaluationResults.overall_score >= 80 ? '🎉' : evaluationResults.overall_score >= 60 ? '👍' : '💪'}
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                {/* Scores Grid */}
                                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                                        {Object.entries(evaluationResults)
                                                                                .filter(([key]) =>
                                                                                        [
                                                                                                'problem_understanding',
                                                                                                'approach_clarity',
                                                                                                'implementation_details',
                                                                                                'edge_case_handling',
                                                                                                'complexity_analysis',
                                                                                                'code_structure',
                                                                                                'correctness',
                                                                                        ].includes(key)
                                                                                )
                                                                                .map(([key, value]) => (
                                                                                        <div key={key} className="p-4 bg-bg-input rounded-lg">
                                                                                                <div className="flex items-center justify-between mb-2">
                                                                                                        <span className="text-sm font-medium capitalize">
                                                                                                                {key.replace(/_/g, ' ')}
                                                                                                        </span>
                                                                                                        <span className="text-lg font-bold text-primary">{value}</span>
                                                                                                </div>
                                                                                                <div className="w-full bg-bg-dark rounded-full h-2 overflow-hidden">
                                                                                                        <div
                                                                                                                className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full animate-fill-bar"
                                                                                                                style={{ width: `${value}%` }}
                                                                                                        />
                                                                                                </div>
                                                                                        </div>
                                                                                ))}
                                                                </div>

                                                                {/* Feedback */}
                                                                <div className="space-y-6">
                                                                        {evaluationResults.strengths && (
                                                                                <div>
                                                                                        <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                                                                                                <span>✓</span> What You Did Well
                                                                                        </h4>
                                                                                        <ul className="space-y-2">
                                                                                                {evaluationResults.strengths.map((strength, index) => (
                                                                                                        <li key={index} className="text-sm text-text-secondary pl-6 relative">
                                                                                                                <span className="absolute left-0 text-success">•</span>
                                                                                                                {strength}
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                </div>
                                                                        )}

                                                                        {evaluationResults.weaknesses && (
                                                                                <div>
                                                                                        <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                                                                                                <span>⚠</span> Areas to Improve
                                                                                        </h4>
                                                                                        <ul className="space-y-2">
                                                                                                {evaluationResults.weaknesses.map((weakness, index) => (
                                                                                                        <li key={index} className="text-sm text-text-secondary pl-6 relative">
                                                                                                                <span className="absolute left-0 text-warning">•</span>
                                                                                                                {weakness}
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                </div>
                                                                        )}

                                                                        {evaluationResults.suggestions && (
                                                                                <div>
                                                                                        <h4 className="font-semibold text-accent-cyan mb-3 flex items-center gap-2">
                                                                                                <span>💡</span> Suggestions
                                                                                        </h4>
                                                                                        <ul className="space-y-2">
                                                                                                {evaluationResults.suggestions.map((suggestion, index) => (
                                                                                                        <li key={index} className="text-sm text-text-secondary pl-6 relative">
                                                                                                                <span className="absolute left-0 text-accent-cyan">•</span>
                                                                                                                {suggestion}
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                </div>
                                                                        )}

                                                                        {evaluationResults.improved_prompt && (
                                                                                <div className="p-6 bg-bg-dark/50 border border-primary/30 rounded-lg">
                                                                                        <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                                                                                <span>✨</span> Improved Prompt Example
                                                                                        </h4>
                                                                                        <p className="text-sm text-text-secondary font-mono leading-relaxed whitespace-pre-wrap">
                                                                                                {evaluationResults.improved_prompt}
                                                                                        </p>
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                <div className="mt-6 flex gap-4">
                                                                        <Button onClick={handleNewChallenge} className="flex-1">
                                                                                Try Another Challenge
                                                                        </Button>
                                                                        <Button variant="secondary" className="flex-1">
                                                                                Download Report
                                                                        </Button>
                                                                </div>
                                                        </Card>
                                                )}
                                        </div>
                                </div>
                        </main>

                        <Toast
                                message={toast.message}
                                type={toast.type}
                                isVisible={toast.visible}
                                onClose={() => setToast((t) => ({ ...t, visible: false }))}
                        />
                </div>
        );
}
