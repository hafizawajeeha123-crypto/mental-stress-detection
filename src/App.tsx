/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Brain, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  BarChart3,
  Terminal,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { classifyMentalStress, MentalHealthClass, ClassificationResult } from './services/geminiService';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const demoSectionRef = useRef<HTMLElement>(null);

  const examples = {
    normal: "Had a really great day today. Went for a morning walk, cooked a nice meal, and caught up with an old friend. Feeling balanced and grateful.",
    depression: "I don't feel anything anymore. Not sad, not happy. Just completely empty inside. I haven't left the house in days and I don't know why I bother.",
    anxiety: "I can't stop thinking about everything that could go wrong. My heart is racing and I just rehearsed the same conversation in my head for the tenth time.",
    bipolar: "Last week I felt absolutely unstoppable — I didn't sleep for two days and spent money I didn't have. This week I can barely get off the floor.",
    stress: "I'm working two jobs and I haven't had a single day off in three weeks. My deadlines keep piling up and I feel like I'm about to snap."
  };

  const classColors: Record<MentalHealthClass, { bg: string, text: string, bar: string, icon: any }> = {
    [MentalHealthClass.NORMAL]: { bg: 'rgba(39,174,96,0.15)', text: '#55d68a', bar: '#27ae60', icon: CheckCircle2 },
    [MentalHealthClass.DEPRESSION]: { bg: 'rgba(26,115,232,0.15)', text: '#4d9fff', bar: '#1a73e8', icon: AlertCircle },
    [MentalHealthClass.SUICIDAL]: { bg: 'rgba(232,75,75,0.15)', text: '#f87070', bar: '#e84b4b', icon: ShieldAlert },
    [MentalHealthClass.ANXIETY]: { bg: 'rgba(245,166,35,0.15)', text: '#ffd080', bar: '#f5a623', icon: AlertTriangle },
    [MentalHealthClass.STRESS]: { bg: 'rgba(0,201,167,0.15)', text: '#00c9a7', bar: '#00c9a7', icon: Zap },
    [MentalHealthClass.BIPOLAR]: { bg: 'rgba(124,92,191,0.15)', text: '#a78bda', bar: '#7c5cbf', icon: TrendingUp },
    [MentalHealthClass.PERSONALITY_DISORDER]: { bg: 'rgba(255,107,157,0.15)', text: '#ffb3d1', bar: '#ff6b9d', icon: Brain },
  };

  const handleClassify = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setIsClassifying(true);
    setError(null);
    try {
      const data = await classifyMentalStress(inputText);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Classification failed. Please check your API configuration.');
    } finally {
      setIsClassifying(false);
    }
  }, [inputText]);

  const loadExample = (type: keyof typeof examples) => {
    setInputText(examples[type]);
    setResult(null);
  };

  return (
    <div className="relative min-h-screen selection:bg-teal-500/30">
      <div className="bg-mesh" />
      <div className="noise" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="font-display text-2xl font-black tracking-tight text-white">
            Mind<span className="text-teal-accent">Sense AI</span>
          </a>
          <ul className="hidden md:flex gap-8 items-center">
            {['Dataset', 'Methodology', 'Results', 'Demo', 'Limitations'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col justify-center px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-accent text-xs font-bold uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
                Advanced NLP Classification
              </div>
              
              <h1 className="font-display text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white mb-8">
                Mental Stress <br />
                <span className="text-teal-accent italic">Detection</span> <br />
                <span className="text-blue-400">from Text</span>
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-white/60 leading-relaxed mb-10">
                MindSense AI leverages state-of-the-art machine learning to analyze textual statements, 
                identifying critical mental health signals across seven distinct diagnostic categories.
              </p>

              <div className="flex flex-wrap gap-4 mb-20">
                <button 
                  onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-teal-accent text-navy font-bold rounded-xl hover:bg-[#00e6c0] transition-all flex items-center gap-2 group"
                >
                  <Activity className="w-5 h-5" />
                  Try Live Demo
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#results" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                  View Results
                </a>
              </div>
            </motion.div>

            {/* Stat Strip */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md"
            >
              {[
                { label: 'Total Samples', value: '212', suffix: 'K' },
                { label: 'Health Classes', value: '7', accent: true },
                { label: 'Best Accuracy', value: '91.9', suffix: '%' },
                { label: 'Models Compared', value: '6', accent: true },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.03] p-8 text-center">
                  <div className="font-display text-4xl font-black text-white mb-1 tracking-tight">
                    {stat.value}
                    <span className="text-teal-accent">{stat.suffix}</span>
                  </div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Dataset Section */}
        <section id="dataset" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16">
            <h3 className="text-teal-accent font-bold text-xs uppercase tracking-widest mb-4">Dataset Overview</h3>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">Mental Stress Dataset</h2>
            <p className="max-w-2xl text-white/60 text-lg">
              Curated from over 212,000 real-world textual statements from social media platforms and online 
              mental health communities. High-fidelity labeling across critical diagnostic markers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(classColors).map(([label, color], i) => (
              <motion.div 
                key={label}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 bg-white/[0.04] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all p-6"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.bar }} />
                <span className="flex-1 font-bold text-white/90">{label}</span>
                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-accent" style={{ width: `${Math.random() * 60 + 40}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="py-24 px-6 bg-white/[0.015] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h3 className="text-teal-accent font-bold text-xs uppercase tracking-widest mb-4">Technical Pipeline</h3>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">How It Works</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-20 text-center">
              {[
                { icon: Brain, label: 'Text Cleaning', desc: 'Removing noise, URLs, and special characters' },
                { icon: Zap, label: 'Tokenization', desc: 'Deep-level linguistic decomposition' },
                { icon: Sparkles, label: 'Lemmatization', desc: 'Root word form stabilization' },
                { icon: BarChart3, label: 'TF-IDF', desc: 'Vectorizing semantic importance' },
                { icon: Activity, label: 'Classification', desc: 'Ensemble model prediction' },
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                    <step.icon className="w-8 h-8 text-teal-accent" />
                  </div>
                  <h4 className="text-sm font-black text-white mb-2">{step.label}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-black/40 rounded-2xl border border-white/5 p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-5 h-5 text-teal-accent" />
                <span className="text-xs font-mono text-white/40">backend_model_architecture.ts</span>
              </div>
              <pre className="font-mono text-sm leading-7 overflow-x-auto">
                <code className="text-white/80">
                  <span className="text-purple-400">const</span> <span className="text-blue-400">vectorizer</span> = <span className="text-yellow-200">new</span> <span className="text-green-400">TfidfVectorizer</span>({'{'} <span className="text-orange-300">maxFeatures</span>: <span className="text-orange-100">5000</span> {'}'});<br />
                  <span className="text-purple-400">const</span> <span className="text-blue-400">classifier</span> = <span className="text-yellow-200">new</span> <span className="text-green-400">RandomForest</span>({'{'} <span className="text-orange-300">nEstimators</span>: <span className="text-orange-100">100</span> {'}'});<br />
                  <br />
                  <span className="text-gray-500">// Stratified training for maximum class balance</span><br />
                  <span className="text-blue-400">model</span>.<span className="text-yellow-400">fit</span>(<span className="text-blue-400">X_train</span>, <span className="text-blue-400">y_train</span>);
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Live Demo */}
        <section id="demo" ref={demoSectionRef} className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center md:text-left">
              <h3 className="text-teal-accent font-bold text-xs uppercase tracking-widest mb-4">Functional Demo</h3>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">Mind Analysis Engine</h2>
              <p className="text-white/60 text-lg">
                Enter your text below to run the classification model in real-time. 
                Experience how NLP identifies mental stress patterns.
              </p>
            </div>

            <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
              <div className="px-6 py-4 bg-white/[0.03] border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                  <div className="w-3 h-3 rounded-full bg-teal-500/50" />
                </div>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest ml-4">stress_classifier_v2.0</span>
              </div>

              <div className="p-8">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-4">Input Statement</label>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a social media post here… e.g. 'I haven't slept properly in weeks and nothing feels real anymore'"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-white text-lg leading-relaxed outline-none focus:border-teal-500/40 transition-all min-h-[160px] resize-none"
                />

                <div className="flex flex-wrap gap-2 mt-6">
                  {Object.keys(examples).map((key) => (
                    <button 
                      key={key}
                      onClick={() => loadExample(key as keyof typeof examples)}
                      className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 text-xs font-bold rounded-lg hover:bg-white/10 hover:text-white transition-all uppercase tracking-tight"
                    >
                      {key}
                    </button>
                  ))}
                  <button 
                    onClick={handleClassify}
                    disabled={isClassifying || !inputText.trim()}
                    className="ml-auto px-8 py-3 bg-teal-accent text-navy font-bold rounded-xl hover:bg-[#00e6c0] disabled:opacity-50 disabled:translate-y-0 transition-all active:scale-95 flex items-center gap-2"
                  >
                    {isClassifying ? (
                      <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    {isClassifying ? 'Analyzing...' : 'Classify →'}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </motion.div>
                  )}

                  {result && (
                    <motion.div 
                      key={inputText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12"
                    >
                      <div 
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-xl mb-8"
                        style={{ backgroundColor: classColors[result.label].bg, color: classColors[result.label].text }}
                      >
                        {(() => {
                           const Icon = classColors[result.label].icon;
                           return <Icon className="w-6 h-6" />;
                        })()}
                        {result.label}
                        <span className="text-xs opacity-60 font-medium ml-2">{Math.round(result.confidence * 100)}% Confidence</span>
                      </div>

                      <div className="space-y-4 mb-8">
                        {(Object.entries(result.probabilities) as [MentalHealthClass, number][]).sort((a,b) => b[1] - a[1]).map(([label, prob]) => (
                          <div key={label} className="group">
                            <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                              <span>{label}</span>
                              <span className="font-mono">{Math.round(prob * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${prob * 100}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: classColors[label]?.bar || '#888' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-sm text-white/70 leading-relaxed italic border-l-4 border-l-teal-accent">
                        <Info className="w-4 h-4 inline mr-2 text-teal-accent" />
                        "{result.explanation}"
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Results Page / Tables */}
        <section id="results" className="py-24 px-6 bg-white/[0.015]">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-teal-accent font-bold text-xs uppercase tracking-widest mb-4">Historical Performance</h3>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-8">Metrics Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {[
                { name: '🌲 Random Forest', acc: '91.9', prec: '0.93', rec: '0.92', best: true },
                { name: '📐 Linear SVM', acc: '87.8', prec: '0.89', rec: '0.89' },
                { name: '📈 Logistic Reg', acc: '87.1', prec: '0.88', rec: '0.88' },
                { name: '🌿 Decision Tree', acc: '87.1', prec: '0.88', rec: '0.88' },
                { name: '🔵 KNN', acc: '78.7', prec: '0.84', rec: '0.80' },
                { name: '📋 Naive Bayes', acc: '78.6', prec: '0.81', rec: '0.80' },
              ].map((model, i) => (
                <div key={i} className={`p-8 rounded-3xl border ${model.best ? 'border-teal-500/40 bg-teal-500/5' : 'border-white/5 bg-white/[0.03]'} transition-all hover:bg-white/[0.06]`}>
                   <div className="flex justify-between items-center mb-6">
                     <h4 className="font-bold text-white uppercase tracking-tight">{model.name}</h4>
                     {model.best && <span className="text-[10px] font-black bg-teal-accent text-navy px-2 py-0.5 rounded-full">BEST</span>}
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between text-xs">
                       <span className="text-white/40">Accuracy</span>
                       <span className="text-white font-mono">{model.acc}%</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-teal-accent" style={{ width: `${model.acc}%` }} />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section id="limitations" className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
             <div className="mb-16">
              <h3 className="text-teal-accent font-bold text-xs uppercase tracking-widest mb-4">Future Perspective</h3>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">Why Not 100%?</h2>
              <p className="max-w-2xl text-white/60 text-lg">
                Classical ML methods hit an architectural ceiling. Semantic context and sarcasm 
                remain the final frontier for deep stress analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🔤', title: 'Bag-of-Words Blindness', desc: 'TF-IDF discards word order and context. Subtle negation can flip meanings entirely.' },
                { icon: '🎭', title: 'Sarcasm Detection', desc: 'Paridoxical language is often missed by frequency-based statistical models.' },
                { icon: '🤗', title: 'Path to LLMs', desc: 'Transitioning to BERT architectures is the next step for state-of-the-art accuracy.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] p-8 rounded-3xl border border-white/5">
                  <div className="text-3xl mb-6">{item.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-4 leading-tight">{item.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-display text-2xl font-black text-white mb-4">Mind<span className="text-teal-accent">Sense AI</span></p>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            A research project focused on building automated screening tools for mental health using natural language processing and classical ensemble learning.
          </p>
          <div className="mt-12 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            NLP in Healthcare • Random Forest Ensemble • TF-IDF Vectorization
          </div>
        </div>
      </footer>
    </div>
  );
}
