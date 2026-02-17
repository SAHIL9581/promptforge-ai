import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { generatePrompt } from '../services/api';  // ✅ Import the function

export default function IdeaToPrompt() {
        const [ideaText, setIdeaText] = useState('');
        const [generatedPrompt, setGeneratedPrompt] = useState('');
        const [isGenerating, setIsGenerating] = useState(false);
        const [showResult, setShowResult] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        const exampleIdeas = [
                'Create a chatbot that helps students learn programming',
                'Build a system to recommend movies based on mood',
                'Design an AI assistant for meal planning',
                'Generate creative marketing slogans for a product',
        ];

        const handleGenerate = async () => {
                if (!ideaText.trim()) {
                        setToast({ message: 'Please enter your idea first!', type: 'error', visible: true });
                        return;
                }

                setIsGenerating(true);
                try {
                        // ✅ Use the imported function which calls /api/generate-prompt
                        const response = await generatePrompt(ideaText);

                        // ✅ Fixed: Use generated_prompt instead of prompt
                        setGeneratedPrompt(response.generated_prompt);
                        setShowResult(true);
                        setToast({ message: 'Prompt generated successfully! 🎉', type: 'success', visible: true });
                } catch (error) {
                        console.error('Generate prompt error:', error);
                        setToast({
                                message: error?.response?.data?.detail || 'Failed to generate prompt. Please try again.',
                                type: 'error',
                                visible: true,
                        });
                } finally {
                        setIsGenerating(false);
                }
        };

        const handleCopy = () => {
                navigator.clipboard.writeText(generatedPrompt);
                setToast({ message: 'Copied to clipboard! 📋', type: 'success', visible: true });
        };

        const handleReset = () => {
                setIdeaText('');
                setGeneratedPrompt('');
                setShowResult(false);
        };

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-bg-dark via-bg-card to-bg-dark">
                                <div className="max-w-5xl mx-auto">
                                        <header className="text-center mb-12 animate-fade-in">
                                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent mb-4">
                                                        Idea → Prompt
                                                </h1>
                                                <p className="text-xl text-text-secondary">
                                                        Transform your creative ideas into powerful, actionable AI prompts
                                                </p>
                                        </header>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Input Section */}
                                                <div className="space-y-6">
                                                        <Card className="p-6 animate-slide-up">
                                                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                                                        <span className="text-3xl">💡</span>
                                                                        Your Idea
                                                                </h2>

                                                                <textarea
                                                                        className="w-full min-h-[300px] p-4 bg-bg-input border border-border rounded-lg text-text-primary text-sm resize-y focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                                                        placeholder="Describe your idea in plain English...

Example:
I want to create a system that analyzes customer reviews and extracts key insights about product quality, common complaints, and feature requests. It should categorize feedback by sentiment and priority."
                                                                        value={ideaText}
                                                                        onChange={(e) => setIdeaText(e.target.value)}
                                                                        disabled={isGenerating}
                                                                />

                                                                <div className="mt-4">
                                                                        <Button
                                                                                onClick={handleGenerate}
                                                                                disabled={isGenerating || !ideaText.trim()}
                                                                                className="w-full h-12 text-lg"
                                                                        >
                                                                                {isGenerating ? (
                                                                                        <>
                                                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                                                                Generating Magic...
                                                                                        </>
                                                                                ) : (
                                                                                        <>
                                                                                                <span className="text-2xl mr-2">✨</span>
                                                                                                Generate Optimized Prompt
                                                                                        </>
                                                                                )}
                                                                        </Button>
                                                                </div>
                                                        </Card>

                                                        <Card className="p-6 bg-gradient-to-br from-accent-cyan/10 to-primary/10 border-accent-cyan/30 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <span className="text-xl">💡</span> Example Ideas
                                                                </h3>
                                                                <div className="space-y-2">
                                                                        {exampleIdeas.map((example, index) => (
                                                                                <button
                                                                                        key={index}
                                                                                        onClick={() => setIdeaText(example)}
                                                                                        disabled={isGenerating}
                                                                                        className="w-full text-left p-3 bg-bg-input hover:bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                >
                                                                                        {example}
                                                                                </button>
                                                                        ))}
                                                                </div>
                                                        </Card>
                                                </div>

                                                {/* Output Section */}
                                                <div className="space-y-6">
                                                        {showResult ? (
                                                                <>
                                                                        <Card className="p-6 animate-slide-up border-2 border-success/30 bg-success/5">
                                                                                <div className="flex items-center justify-between mb-4">
                                                                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                                                                                <span className="text-3xl">🎯</span>
                                                                                                Generated Prompt
                                                                                        </h2>
                                                                                        <div className="flex gap-2">
                                                                                                <Button onClick={handleCopy} variant="secondary" className="text-sm">
                                                                                                        📋 Copy
                                                                                                </Button>
                                                                                                <Button onClick={handleReset} variant="secondary" className="text-sm">
                                                                                                        🔄 Reset
                                                                                                </Button>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="p-4 bg-bg-dark/50 border border-primary/30 rounded-lg">
                                                                                        <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
                                                                                                {generatedPrompt}
                                                                                        </pre>
                                                                                </div>
                                                                        </Card>

                                                                        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                                                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                                                        <span className="text-xl">📈</span> How to Use This Prompt
                                                                                </h3>
                                                                                <ol className="space-y-3 text-sm text-text-secondary">
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0 text-primary font-bold">1.</span>
                                                                                                Copy the generated prompt to your clipboard
                                                                                        </li>
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0 text-primary font-bold">2.</span>
                                                                                                Paste it into ChatGPT, Claude, or your AI tool
                                                                                        </li>
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0 text-primary font-bold">3.</span>
                                                                                                Review and customize based on your needs
                                                                                        </li>
                                                                                        <li className="pl-6 relative">
                                                                                                <span className="absolute left-0 text-primary font-bold">4.</span>
                                                                                                Iterate and refine the prompt for better results
                                                                                        </li>
                                                                                </ol>
                                                                        </Card>
                                                                </>
                                                        ) : (
                                                                <Card className="p-8 flex items-center justify-center min-h-[400px] animate-slide-up">
                                                                        <div className="text-center">
                                                                                <div className="text-7xl mb-6 animate-bounce">💭</div>
                                                                                <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Idea?</h3>
                                                                                <p className="text-text-secondary max-w-md">
                                                                                        Enter your idea on the left and click "Generate" to create an optimized AI prompt
                                                                                </p>
                                                                        </div>
                                                                </Card>
                                                        )}

                                                        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent-pink/10 border-primary/30 animate-slide-up" style={{ animationDelay: showResult ? '0.2s' : '0.1s' }}>
                                                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <span className="text-xl">⭐</span> Prompt Engineering Tips
                                                                </h3>
                                                                <ul className="space-y-2 text-sm text-text-secondary">
                                                                        <li className="flex items-start gap-2">
                                                                                <span className="text-primary">•</span>
                                                                                <span>Be specific about your goal and desired outcome</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-2">
                                                                                <span className="text-primary">•</span>
                                                                                <span>Include context and any relevant constraints</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-2">
                                                                                <span className="text-primary">•</span>
                                                                                <span>Specify the format and structure of the output</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-2">
                                                                                <span className="text-primary">•</span>
                                                                                <span>Provide examples when possible for better results</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-2">
                                                                                <span className="text-primary">•</span>
                                                                                <span>Test and iterate - refine based on AI responses</span>
                                                                        </li>
                                                                </ul>
                                                        </Card>
                                                </div>
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
