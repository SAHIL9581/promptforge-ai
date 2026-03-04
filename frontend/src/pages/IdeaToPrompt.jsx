import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { generatePrompt } from '../services/api';

const DS = {
        bg: '#040610',
        surface: 'rgba(10, 15, 30, 0.6)',
        cyan: '#00e5ff',
        cyanDim: '#00b8cc',
        purple: '#7c3aed',
        purple2: '#a855f7',
        gold: '#f59e0b',
        textPrimary: '#e2e8f0',
        textMuted: '#64748b',
        border: 'rgba(0, 229, 255, 0.12)',
};

const gradientText = {
        background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
};

const cardStyle = {
        background: 'rgba(10, 15, 30, 0.6)',
        border: '1px solid rgba(0, 229, 255, 0.12)',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '24px',
};

export default function IdeaToPrompt() {
        const [ideaText, setIdeaText] = useState('');
        const [generatedPrompt, setGeneratedPrompt] = useState('');
        const [isGenerating, setIsGenerating] = useState(false);
        const [showResult, setShowResult] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        useEffect(() => {
                const style = document.createElement('style');
                style.id = 'pf-idea-fonts';
                style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(0,229,255,.3); }
        50%       { box-shadow: 0 0 30px rgba(0,229,255,.6); }
      }
      @keyframes spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .idea-textarea::placeholder { color: #64748b; }
      .idea-textarea:focus {
        border-color: rgba(0,229,255,.5) !important;
        box-shadow: 0 0 0 3px rgba(0,229,255,.08) !important;
        outline: none;
      }
      .example-btn:hover {
        background: rgba(0,229,255,.06) !important;
        color: #e2e8f0 !important;
        border-color: rgba(0,229,255,.3) !important;
      }
      .pf-prose p { color: #94a3b8; line-height: 1.7; margin-bottom: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; }
      .pf-prose strong { color: #e2e8f0; font-weight: 600; }
      .pf-prose h1, .pf-prose h2, .pf-prose h3 { font-family: 'Orbitron', sans-serif; color: #fff; margin: 16px 0 8px; }
      .pf-prose ul, .pf-prose ol { color: #94a3b8; padding-left: 20px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.8; }
      .pf-prose li { margin-bottom: 4px; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #040610; }
      ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
    `;
                if (!document.getElementById('pf-idea-fonts')) {
                        document.head.appendChild(style);
                }
        }, []);

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
                        const response = await generatePrompt(ideaText);
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
                <div style={{
                        display: 'flex', minHeight: '100vh',
                        background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                        fontFamily: 'DM Sans, sans-serif',
                }}>
                        <Sidebar />

                        {/* Glow blobs */}
                        <div style={{
                                position: 'fixed', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0,229,255,.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0
                        }} />
                        <div style={{
                                position: 'fixed', bottom: '10%', right: '5%', width: '350px', height: '350px', borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(124,58,237,.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0
                        }} />

                        <main style={{ flex: 1, marginLeft: '256px', padding: '32px', position: 'relative', zIndex: 1 }}>
                                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                                        {/* Header */}
                                        <header style={{ textAlign: 'center', marginBottom: '48px', animation: 'slideUp 0.7s ease both' }}>
                                                <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '6px 16px', border: '1px solid rgba(0,229,255,.25)',
                                                        borderRadius: '999px', background: 'rgba(0,229,255,.06)',
                                                        fontSize: '13px', color: DS.cyan, letterSpacing: '.5px',
                                                        marginBottom: '20px',
                                                }}>
                                                        ✨ Prompt Generator
                                                </div>
                                                <h1 style={{
                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '52px', fontWeight: 900,
                                                        letterSpacing: '-1px', color: '#fff', marginBottom: '16px',
                                                }}>
                                                        Idea{' '}
                                                        <span style={gradientText}>→</span>
                                                        {' '}Prompt
                                                </h1>
                                                <p style={{ fontSize: '16px', color: DS.textMuted, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                                                        Transform your creative ideas into powerful, actionable AI prompts
                                                </p>
                                        </header>

                                        {/* Two Column Layout */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                                                {/* LEFT — Input Section */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                                        {/* Your Idea Card */}
                                                        <div style={{ ...cardStyle, animation: 'slideUp 0.5s 0.1s ease both' }}>
                                                                <h2 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700,
                                                                        color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px',
                                                                }}>
                                                                        <span>💡</span> Your Idea
                                                                </h2>

                                                                <textarea
                                                                        className="idea-textarea"
                                                                        style={{
                                                                                width: '100%', minHeight: '280px', padding: '14px 16px',
                                                                                background: 'rgba(0,0,0,0.4)',
                                                                                border: '1px solid rgba(0,229,255,.15)',
                                                                                borderRadius: '10px',
                                                                                color: DS.textPrimary,
                                                                                fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                                                                                resize: 'vertical', transition: 'border-color .2s, box-shadow .2s',
                                                                                boxSizing: 'border-box',
                                                                        }}
                                                                        placeholder={`Describe your idea in plain English...\n\nExample:\nI want to create a system that analyzes customer reviews and extracts key insights about product quality, common complaints, and feature requests.`}
                                                                        value={ideaText}
                                                                        onChange={(e) => setIdeaText(e.target.value)}
                                                                        disabled={isGenerating}
                                                                />

                                                                <div style={{ marginTop: '16px' }}>
                                                                        <button
                                                                                onClick={handleGenerate}
                                                                                disabled={isGenerating || !ideaText.trim()}
                                                                                style={{
                                                                                        width: '100%', height: '48px', borderRadius: '8px', border: 'none',
                                                                                        background: isGenerating || !ideaText.trim()
                                                                                                ? 'rgba(0,229,255,0.15)'
                                                                                                : 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                                        color: isGenerating || !ideaText.trim() ? DS.textMuted : '#000',
                                                                                        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px',
                                                                                        cursor: isGenerating || !ideaText.trim() ? 'not-allowed' : 'pointer',
                                                                                        boxShadow: isGenerating || !ideaText.trim() ? 'none' : '0 0 20px rgba(0,229,255,.35)',
                                                                                        transition: 'transform .2s, box-shadow .2s',
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                                                }}
                                                                                onMouseEnter={e => {
                                                                                        if (!isGenerating && ideaText.trim()) {
                                                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                                                e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)';
                                                                                        }
                                                                                }}
                                                                                onMouseLeave={e => {
                                                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                                                        e.currentTarget.style.boxShadow = isGenerating || !ideaText.trim() ? 'none' : '0 0 20px rgba(0,229,255,.35)';
                                                                                }}
                                                                        >
                                                                                {isGenerating ? (
                                                                                        <>
                                                                                                <div style={{
                                                                                                        width: '18px', height: '18px',
                                                                                                        border: '2px solid rgba(0,0,0,0.2)',
                                                                                                        borderTop: '2px solid #000',
                                                                                                        borderRadius: '50%',
                                                                                                        animation: 'spin 0.8s linear infinite',
                                                                                                }} />
                                                                                                Generating Magic...
                                                                                        </>
                                                                                ) : (
                                                                                        <> ✨ Generate Optimized Prompt </>
                                                                                )}
                                                                        </button>
                                                                </div>
                                                        </div>

                                                        {/* Example Ideas Card */}
                                                        <div style={{
                                                                ...cardStyle,
                                                                borderColor: 'rgba(0,229,255,0.15)',
                                                                background: 'rgba(0,229,255,0.03)',
                                                                animation: 'slideUp 0.5s 0.2s ease both',
                                                        }}>
                                                                <h3 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                        color: DS.cyan, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px',
                                                                        display: 'flex', alignItems: 'center', gap: '8px',
                                                                }}>
                                                                        💡 Example Ideas
                                                                </h3>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                        {exampleIdeas.map((example, index) => (
                                                                                <button
                                                                                        key={index}
                                                                                        className="example-btn"
                                                                                        onClick={() => setIdeaText(example)}
                                                                                        disabled={isGenerating}
                                                                                        style={{
                                                                                                width: '100%', textAlign: 'left', padding: '12px 14px',
                                                                                                background: 'rgba(0,0,0,0.3)',
                                                                                                border: '1px solid rgba(0,229,255,.12)',
                                                                                                borderRadius: '8px', fontSize: '13px',
                                                                                                color: DS.textMuted,
                                                                                                fontFamily: 'DM Sans, sans-serif',
                                                                                                cursor: isGenerating ? 'not-allowed' : 'pointer',
                                                                                                transition: 'all 0.2s',
                                                                                                opacity: isGenerating ? 0.5 : 1,
                                                                                        }}
                                                                                >
                                                                                        {example}
                                                                                </button>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* RIGHT — Output Section */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                        {showResult ? (
                                                                <>
                                                                        {/* Generated Prompt Card */}
                                                                        <div style={{
                                                                                ...cardStyle,
                                                                                borderColor: 'rgba(0,229,255,0.25)',
                                                                                animation: 'slideUp 0.5s ease both',
                                                                        }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                                                        <h2 style={{
                                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700,
                                                                                                color: '#fff', display: 'flex', alignItems: 'center', gap: '10px',
                                                                                        }}>
                                                                                                <span>🎯</span> Generated Prompt
                                                                                        </h2>
                                                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                                                <button
                                                                                                        onClick={handleCopy}
                                                                                                        style={{
                                                                                                                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                                                                                                background: 'transparent', color: DS.cyan,
                                                                                                                border: '1px solid rgba(0,229,255,.3)',
                                                                                                                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all .2s',
                                                                                                        }}
                                                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                                                >
                                                                                                        📋 Copy
                                                                                                </button>
                                                                                                <button
                                                                                                        onClick={handleReset}
                                                                                                        style={{
                                                                                                                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                                                                                                background: 'transparent', color: DS.textMuted,
                                                                                                                border: '1px solid rgba(255,255,255,.1)',
                                                                                                                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all .2s',
                                                                                                        }}
                                                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
                                                                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                                                >
                                                                                                        🔄 Reset
                                                                                                </button>
                                                                                        </div>
                                                                                </div>

                                                                                <div style={{
                                                                                        padding: '20px',
                                                                                        background: 'rgba(0,0,0,0.5)',
                                                                                        border: '1px solid rgba(0,229,255,.12)',
                                                                                        borderRadius: '10px',
                                                                                        maxHeight: '520px',
                                                                                        overflowY: 'auto',
                                                                                }}>
                                                                                        <div className="pf-prose">
                                                                                                <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
                                                                                        </div>
                                                                                </div>
                                                                        </div>

                                                                        {/* How to Use Card */}
                                                                        <div style={{ ...cardStyle, animation: 'slideUp 0.5s 0.1s ease both' }}>
                                                                                <h3 style={{
                                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                                        color: DS.cyan, letterSpacing: '2px', textTransform: 'uppercase',
                                                                                        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                                                                                }}>
                                                                                        📈 How to Use This Prompt
                                                                                </h3>
                                                                                <ol style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '0', listStyle: 'none' }}>
                                                                                        {[
                                                                                                'Copy the generated prompt to your clipboard',
                                                                                                'Paste it into ChatGPT, Claude, or your AI tool',
                                                                                                'Review and customize based on your needs',
                                                                                                'Iterate and refine the prompt for better results',
                                                                                        ].map((step, i) => (
                                                                                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: DS.textMuted }}>
                                                                                                        <span style={{
                                                                                                                minWidth: '24px', height: '24px', borderRadius: '50%',
                                                                                                                background: 'rgba(0,229,255,.1)', border: '1px solid rgba(0,229,255,.25)',
                                                                                                                color: DS.cyan, fontSize: '12px', fontFamily: 'Orbitron, sans-serif',
                                                                                                                fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                                        }}>
                                                                                                                {i + 1}
                                                                                                        </span>
                                                                                                        {step}
                                                                                                </li>
                                                                                        ))}
                                                                                </ol>
                                                                        </div>
                                                                </>
                                                        ) : (
                                                                /* Empty State */
                                                                <div style={{
                                                                        ...cardStyle,
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        minHeight: '360px', animation: 'slideUp 0.5s ease both',
                                                                }}>
                                                                        <div style={{ textAlign: 'center' }}>
                                                                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>💭</div>
                                                                                <h3 style={{
                                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 700,
                                                                                        color: '#fff', marginBottom: '12px',
                                                                                }}>
                                                                                        Ready to Transform Your Idea?
                                                                                </h3>
                                                                                <p style={{ color: DS.textMuted, fontSize: '14px', maxWidth: '320px', lineHeight: 1.7 }}>
                                                                                        Enter your idea on the left and click "Generate" to create an optimized AI prompt
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Tips Card */}
                                                        <div style={{
                                                                ...cardStyle,
                                                                background: 'rgba(124,58,237,0.05)',
                                                                borderColor: 'rgba(168,85,247,0.2)',
                                                                animation: `slideUp 0.5s ${showResult ? '0.2s' : '0.1s'} ease both`,
                                                        }}>
                                                                <h3 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                        color: DS.purple2, letterSpacing: '2px', textTransform: 'uppercase',
                                                                        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                                                                }}>
                                                                        ⭐ Prompt Engineering Tips
                                                                </h3>
                                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '0', listStyle: 'none' }}>
                                                                        {[
                                                                                'Be specific about your goal and desired outcome',
                                                                                'Include context and any relevant constraints',
                                                                                'Specify the format and structure of the output',
                                                                                'Provide examples when possible for better results',
                                                                                'Test and iterate — refine based on AI responses',
                                                                        ].map((tip, i) => (
                                                                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: DS.textMuted }}>
                                                                                        <span style={{ color: DS.purple2, marginTop: '2px' }}>•</span>
                                                                                        {tip}
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
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
