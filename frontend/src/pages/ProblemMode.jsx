import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Toast from '../components/Toast';
import api from '../services/api';

export default function ProblemMode() {
        const navigate = useNavigate();
        const [problemType, setProblemType] = useState('');
        const [currentProblem, setCurrentProblem] = useState(null);
        const [userPrompt, setUserPrompt] = useState('');
        const [wordCount, setWordCount] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [isEvaluating, setIsEvaluating] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        const problemTypes = [
                {
                        id: 'system',
                        name: 'System Design',
                        icon: '🏗️',
                        color: 'from-primary to-accent-cyan',
                        description: 'Design scalable systems and architectures',
                },
                {
                        id: 'ai',
                        name: 'AI Problems',
                        icon: '🤖',
                        color: 'from-accent-pink to-pink-400',
                        description: 'AI/ML challenges and prompt optimization',
                },
        ];

        const updateWordCount = (text) => {
                const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
                setWordCount(words);
        };

        const handlePromptChange = (e) => {
                const text = e.target.value;
                setUserPrompt(text);
                updateWordCount(text);
        };

        const handleGenerateProblem = async (type) => {
                setIsLoading(true);
                setProblemType(type);
                try {
                        const response = await api.get(`/api/problem/${type}`);
                        setCurrentProblem(response.data);
                        setUserPrompt('');
                        setWordCount(0);
                        setToast({ message: 'Problem loaded! 🎯', type: 'success', visible: true });
                } catch (error) {
                        console.error('Problem fetch error:', error);

                        // ✅ FIXED: Better error handling
                        let errorMessage = 'Failed to load problem.';

                        if (error.response?.data?.detail) {
                                // Handle string or object detail
                                if (typeof error.response.data.detail === 'string') {
                                        errorMessage = error.response.data.detail;
                                } else if (Array.isArray(error.response.data.detail)) {
                                        // Handle validation errors
                                        errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
                                } else {
                                        errorMessage = 'Server error occurred.';
                                }
                        } else if (error.message) {
                                errorMessage = error.message;
                        }

                        setToast({
                                message: errorMessage,
                                type: 'error',
                                visible: true,
                        });
                } finally {
                        setIsLoading(false);
                }
        };

        const handleEvaluate = async () => {
                if (!userPrompt.trim()) {
                        setToast({ message: 'Please write your prompt first!', type: 'error', visible: true });
                        return;
                }

                setIsEvaluating(true);
                try {
                        // ✅ FIXED: Send proper format to backend
                        const response = await api.post('/api/evaluate', {
                                problem_text: currentProblem.scenario || currentProblem.title,
                                problem_source: currentProblem.source || 'Unknown',
                                user_prompt: userPrompt,
                        });

                        navigate('/evaluation-result', {
                                state: {
                                        evaluation: response.data,
                                        problem: currentProblem,
                                        userPrompt
                                }
                        });
                } catch (error) {
                        console.error('Evaluation error:', error);

                        // ✅ FIXED: Better error handling
                        let errorMessage = 'Evaluation failed. Please try again.';

                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') {
                                        errorMessage = error.response.data.detail;
                                } else if (Array.isArray(error.response.data.detail)) {
                                        errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
                                }
                        } else if (error.message) {
                                errorMessage = error.message;
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

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8">
                                <div className="max-w-7xl mx-auto">
                                        {!currentProblem ? (
                                                // Problem Type Selection
                                                <div>
                                                        <header className="text-center mb-12 animate-fade-in">
                                                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent mb-4">
                                                                        Problem Mode
                                                                </h1>
                                                                <p className="text-xl text-text-secondary">
                                                                        Choose a problem type to start practicing your prompt engineering skills
                                                                </p>
                                                        </header>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                                                {problemTypes.map((type) => (
                                                                        <Card
                                                                                key={type.id}
                                                                                className="p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                                                                hasTopBorder
                                                                                borderColor={type.color}
                                                                        >
                                                                                <div className="text-center">
                                                                                        <div className="text-7xl mb-6">{type.icon}</div>
                                                                                        <h2 className="text-2xl font-bold mb-3">{type.name}</h2>
                                                                                        <p className="text-text-secondary mb-6">{type.description}</p>
                                                                                        <Button
                                                                                                onClick={() => handleGenerateProblem(type.id)}
                                                                                                isLoading={isLoading && problemType === type.id}
                                                                                                className="w-full"
                                                                                        >
                                                                                                {isLoading && problemType === type.id ? 'Loading...' : 'Start Challenge'}
                                                                                        </Button>
                                                                                </div>
                                                                        </Card>
                                                                ))}
                                                        </div>
                                                </div>
                                        ) : (
                                                // Problem Workspace
                                                <div>
                                                        <header className="bg-bg-card/80 backdrop-blur-xl border border-border rounded-xl p-6 mb-8 animate-slide-up">
                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <div className="flex items-center gap-3 mb-2">
                                                                                        <h1 className="text-3xl font-bold">{currentProblem.title}</h1>
                                                                                        <Badge variant="default">{problemType === 'system' ? 'System Design' : 'AI Problem'}</Badge>
                                                                                        {currentProblem.difficulty && <Badge variant="default">{currentProblem.difficulty}</Badge>}
                                                                                </div>
                                                                                <p className="text-text-secondary">{currentProblem.context}</p>
                                                                        </div>
                                                                        <Button onClick={() => setCurrentProblem(null)} variant="secondary">
                                                                                🔄 Change Problem
                                                                        </Button>
                                                                </div>
                                                        </header>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                                {/* Problem Details */}
                                                                <Card className="p-6 h-fit">
                                                                        <h2 className="text-xl font-bold mb-4 text-accent-cyan">Problem Details</h2>

                                                                        <div className="space-y-6">
                                                                                <div>
                                                                                        <h3 className="font-semibold mb-2 text-primary">Scenario</h3>
                                                                                        <p className="text-text-secondary text-sm leading-relaxed">{currentProblem.scenario}</p>
                                                                                </div>

                                                                                {currentProblem.requirements && (
                                                                                        <div>
                                                                                                <h3 className="font-semibold mb-2 text-primary">Requirements</h3>
                                                                                                <ul className="space-y-2">
                                                                                                        {currentProblem.requirements.map((req, index) => (
                                                                                                                <li key={index} className="text-sm text-text-secondary pl-6 relative">
                                                                                                                        <span className="absolute left-0 text-success">✓</span>
                                                                                                                        {req}
                                                                                                                </li>
                                                                                                        ))}
                                                                                                </ul>
                                                                                        </div>
                                                                                )}

                                                                                {currentProblem.constraints && (
                                                                                        <div>
                                                                                                <h3 className="font-semibold mb-2 text-primary">Constraints</h3>
                                                                                                <ul className="space-y-2">
                                                                                                        {currentProblem.constraints.map((constraint, index) => (
                                                                                                                <li key={index} className="text-sm text-text-secondary pl-6 relative">
                                                                                                                        <span className="absolute left-0 text-warning">!</span>
                                                                                                                        {constraint}
                                                                                                                </li>
                                                                                                        ))}
                                                                                                </ul>
                                                                                        </div>
                                                                                )}

                                                                                {currentProblem.example_input && (
                                                                                        <div className="p-4 bg-bg-dark/50 border border-border rounded-lg">
                                                                                                <h3 className="font-semibold mb-2 text-accent-cyan text-sm">Example Input</h3>
                                                                                                <p className="text-text-secondary text-sm font-mono">{currentProblem.example_input}</p>
                                                                                        </div>
                                                                                )}

                                                                                {currentProblem.example_output && (
                                                                                        <div className="p-4 bg-bg-dark/50 border border-border rounded-lg">
                                                                                                <h3 className="font-semibold mb-2 text-success text-sm">Expected Output</h3>
                                                                                                <p className="text-text-secondary text-sm font-mono">{currentProblem.example_output}</p>
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </Card>

                                                                {/* Prompt Editor */}
                                                                <div className="space-y-6">
                                                                        <Card className="p-6">
                                                                                <h2 className="text-xl font-bold mb-4">Write Your Prompt</h2>

                                                                                <textarea
                                                                                        className="w-full min-h-[500px] p-4 bg-bg-input border border-border rounded-lg text-text-primary font-mono text-sm resize-y focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                                                                        placeholder={`Write a clear, specific prompt to solve this ${problemType === 'system' ? 'system design' : 'AI'} problem...

Example structure:
1. Understand the problem
2. Break down requirements
3. Propose solution approach
4. Address constraints
5. Provide implementation details`}
                                                                                        value={userPrompt}
                                                                                        onChange={handlePromptChange}
                                                                                />

                                                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                                                                        <div className="text-sm">
                                                                                                <span className="text-text-secondary">Words:</span>
                                                                                                <span className="ml-2 font-semibold text-primary">{wordCount}</span>
                                                                                        </div>
                                                                                        <Button onClick={handleEvaluate} isLoading={isEvaluating}>
                                                                                                {isEvaluating ? 'Evaluating...' : '✨ Evaluate Prompt'}
                                                                                        </Button>
                                                                                </div>
                                                                        </Card>

                                                                        <Card className="p-6 bg-gradient-to-br from-accent-cyan/10 to-primary/10 border-accent-cyan/30">
                                                                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                                                        <span>💡</span> Prompt Writing Tips
                                                                                </h3>
                                                                                <ul className="space-y-2 text-sm text-text-secondary">
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0">•</span>
                                                                                                Be specific about what you want the AI to do
                                                                                        </li>
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0">•</span>
                                                                                                Include relevant context and constraints
                                                                                        </li>
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0">•</span>
                                                                                                Break down complex problems into steps
                                                                                        </li>
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0">•</span>
                                                                                                Specify the desired output format
                                                                                        </li>
                                                                                </ul>
                                                                        </Card>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}
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
