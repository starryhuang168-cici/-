import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Mail, 
  Share2, 
  LayoutDashboard, 
  ChevronRight, 
  Send, 
  Loader2,
  Globe,
  TrendingUp,
  ShieldCheck,
  Clock,
  Package,
  Camera
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateContent } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'market' | 'customer' | 'email' | 'social';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('market');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form States
  const [marketForm, setMarketForm] = useState({ country: '', season: '', price: '', observations: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', link: '' });
  const [emailForm, setEmailForm] = useState({ country: '', type: '', product: '', features: '', stage: '1' });
  const [socialForm, setSocialForm] = useState({ product: '', market: '', sellingPoints: '', focus: '' });

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    let prompt = '';
    let systemInstruction = '';

    if (activeModule === 'market') {
      systemInstruction = `你是一名欧洲家具市场分析顾问。任务：根据欧洲市场趋势，结合中小零售商特点，判断本周适合重点开发和主推的产品方向。重点考虑：包装体积小（低CBM）低破损率，易组装，可混柜销售，中端/中低端价格带，适合试单启动。输出格式：本周建议主推品类（1–2个），市场趋势逻辑，为什么适合中小客户，推荐试单切入方式，建议开发国家。`;
      prompt = `目标国家：${marketForm.country}\n目标销售季度：${marketForm.season}\n目标价格带：${marketForm.price}\n近期平台观察情况：${marketForm.observations}`;
    } else if (activeModule === 'customer') {
      systemInstruction = `你是一名欧洲B2B客户分析顾问。任务：根据客户信息，判断是否适合试单开发，以及未来是否有补单潜力。输出：客户等级（A稳定潜力 / B试单潜力 / C低优先级）、判断逻辑、适合切入的产品方向、推荐试单话术角度、是否值得重点跟进。用商业逻辑判断，不要模糊表达。`;
      prompt = `客户名称：${customerForm.name}\n客户线上网站/店铺链接：${customerForm.link}`;
    } else if (activeModule === 'email') {
      systemInstruction = `你是一名欧洲家具B2B销售流程策略专家。你的任务：根据我提供的客户国家、客户类型、本周主推产品、客户特点、当前所处阶段，只生成该阶段的一封邮件（中文版本）。禁止一次性输出多个阶段邮件。必须根据我给出的“当前阶段”进行针对性输出。
      可识别销售阶段包括：1. 首次开发信, 2. 无回复7天后的跟进, 3. 报价后跟进, 4. 技术讨论阶段, 5. 样品沟通阶段, 6. 长期未联系后的重新激活, 7. 临近决策阶段。
      核心销售原则：所有邮件都围绕“降低客户风险”展开。必须自然体现我们的核心优势：低MOQ、支持混柜、30天生产周期、可提供完整销售图片、提供设计师支持、不打价格战，强调稳定合作。
      语气要求：专业、克制、冷静、自信但不强推。符合欧洲B2B沟通风格。
      在输出邮件前：请先用2-3句话简要说明该阶段的销售策略逻辑。然后再输出正式邮件内容。`;
      prompt = `客户国家：${emailForm.country}\n客户类型：${emailForm.type}\n本周主推产品：${emailForm.product}\n客户特点：${emailForm.features}\n当前所处阶段：${emailForm.stage}`;
    } else if (activeModule === 'social') {
      systemInstruction = `你是一名专门为欧洲家具B2B出口设计社媒策略的顾问。平台：Facebook 和 Instagram。目标：增强信任感 + 支持试单转化。生成：Facebook 内容方向（B2B语气）、Instagram 重点、一条 Reels 视频脚本（30秒以内）。
      要求：强调试单安全、强调混柜灵活、适合欧洲B2B受众、避免空泛品牌故事。默认中文输出、控制字数、避免夸张表达、强调结构逻辑、不使用“best price”“leading manufacturer”等表达。`;
      prompt = `本周主推产品：${socialForm.product}\n目标市场：${socialForm.market}\n核心卖点：${socialForm.sellingPoints}\n本周重点强调：${socialForm.focus}`;
    }

    const response = await generateContent(prompt, systemInstruction);
    setResult(response);
    setLoading(false);
  };

  const navItems = [
    { id: 'market', label: '市场分析', icon: BarChart3 },
    { id: 'customer', label: '客户分析', icon: Users },
    { id: 'email', label: '邮件生成', icon: Mail },
    { id: 'social', label: '社媒内容', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E0] flex flex-col">
        <div className="p-6 border-bottom border-[#E5E5E0]">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#5A5A40]" />
            B2B 增长助手
          </h1>
          <p className="text-xs text-[#8E8E8E] mt-1 uppercase tracking-widest">European Furniture Strategy</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as Module);
                setResult(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeModule === item.id 
                  ? 'bg-[#5A5A40] text-white shadow-md' 
                  : 'text-[#555] hover:bg-[#F0F0EB]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#E5E5E0] space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#8E8E8E]">
            <ShieldCheck className="w-4 h-4" />
            <span>核心优势：低MOQ / 混柜</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8E8E8E]">
            <Clock className="w-4 h-4" />
            <span>生产周期：30天</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E5E5E0] flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-[#8E8E8E]">
            <span>工作台</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1A1A1A] font-medium">
              {navItems.find(n => n.id === activeModule)?.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-[#E5E5E0] px-2 py-1 rounded text-[#555]">欧洲中小零售商专供</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E0]">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  配置参数
                </h2>
                
                <AnimatePresence mode="wait">
                  {activeModule === 'market' && (
                    <motion.div 
                      key="market"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">目标国家</label>
                        <input 
                          type="text" 
                          placeholder="例如：德国、法国"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={marketForm.country}
                          onChange={e => setMarketForm({...marketForm, country: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">目标销售季度</label>
                        <input 
                          type="text" 
                          placeholder="例如：Q3 户外季"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={marketForm.season}
                          onChange={e => setMarketForm({...marketForm, season: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">目标价格带</label>
                        <input 
                          type="text" 
                          placeholder="例如：中端、50-150 EUR"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={marketForm.price}
                          onChange={e => setMarketForm({...marketForm, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">近期平台观察</label>
                        <textarea 
                          rows={3}
                          placeholder="例如：Amazon上极简风餐椅销量上升"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none resize-none"
                          value={marketForm.observations}
                          onChange={e => setMarketForm({...marketForm, observations: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeModule === 'customer' && (
                    <motion.div 
                      key="customer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">客户名称</label>
                        <input 
                          type="text" 
                          placeholder="例如：Möbel Haus GmbH"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={customerForm.name}
                          onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">线上网站/店铺链接</label>
                        <input 
                          type="url" 
                          placeholder="https://..."
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={customerForm.link}
                          onChange={e => setCustomerForm({...customerForm, link: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeModule === 'email' && (
                    <motion.div 
                      key="email"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">客户国家</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                            value={emailForm.country}
                            onChange={e => setEmailForm({...emailForm, country: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">客户类型</label>
                          <input 
                            type="text" 
                            placeholder="电商/线下店"
                            className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                            value={emailForm.type}
                            onChange={e => setEmailForm({...emailForm, type: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">本周主推产品</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={emailForm.product}
                          onChange={e => setEmailForm({...emailForm, product: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">客户特点</label>
                        <input 
                          type="text" 
                          placeholder="例如：注重环保、SKU较多"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={emailForm.features}
                          onChange={e => setEmailForm({...emailForm, features: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">当前阶段</label>
                        <select 
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={emailForm.stage}
                          onChange={e => setEmailForm({...emailForm, stage: e.target.value})}
                        >
                          <option value="1">1. 首次开发信</option>
                          <option value="2">2. 无回复7天后的跟进</option>
                          <option value="3">3. 报价后跟进</option>
                          <option value="4">4. 技术讨论阶段</option>
                          <option value="5">5. 样品沟通阶段</option>
                          <option value="6">6. 长期未联系后的重新激活</option>
                          <option value="7">7. 临近决策阶段</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {activeModule === 'social' && (
                    <motion.div 
                      key="social"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">本周主推产品</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={socialForm.product}
                          onChange={e => setSocialForm({...socialForm, product: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">目标市场</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={socialForm.market}
                          onChange={e => setSocialForm({...socialForm, market: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">核心卖点</label>
                        <input 
                          type="text" 
                          placeholder="例如：FSC认证、免工具组装"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={socialForm.sellingPoints}
                          onChange={e => setSocialForm({...socialForm, sellingPoints: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8E8E8E] uppercase mb-1">本周重点强调</label>
                        <input 
                          type="text" 
                          placeholder="例如：支持混柜、30天交期"
                          className="w-full px-4 py-2 bg-[#F9F9F7] border border-[#E5E5E0] rounded-lg focus:ring-2 focus:ring-[#5A5A40] outline-none"
                          value={socialForm.focus}
                          onChange={e => setSocialForm({...socialForm, focus: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full mt-6 bg-[#5A5A40] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#4A4A35] transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {loading ? '生成中...' : '开始生成策略'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] flex items-center gap-3">
                  <div className="bg-[#F0F0EB] p-2 rounded-lg">
                    <Package className="w-5 h-5 text-[#5A5A40]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8E8E8E] uppercase font-bold">低 CBM</p>
                    <p className="text-sm font-semibold">节省物流成本</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] flex items-center gap-3">
                  <div className="bg-[#F0F0EB] p-2 rounded-lg">
                    <Camera className="w-5 h-5 text-[#5A5A40]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8E8E8E] uppercase font-bold">素材支持</p>
                    <p className="text-sm font-semibold">完整销售图片</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Result Section */}
            <section className="flex flex-col">
              <div className="bg-white flex-1 p-8 rounded-2xl shadow-sm border border-[#E5E5E0] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">策略输出</h2>
                  {result && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(result || '')}
                      className="text-xs text-[#5A5A40] font-bold uppercase hover:underline"
                    >
                      复制内容
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#8E8E8E] space-y-4">
                      <Loader2 className="w-12 h-12 animate-spin text-[#5A5A40]" />
                      <p className="animate-pulse">正在调取欧洲市场模型...</p>
                    </div>
                  ) : result ? (
                    <div className="markdown-body prose prose-sm max-w-none">
                      <Markdown>{result}</Markdown>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#8E8E8E] text-center space-y-4">
                      <div className="bg-[#F9F9F7] p-6 rounded-full">
                        <TrendingUp className="w-12 h-12 opacity-20" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">等待输入参数</p>
                        <p className="text-sm">请在左侧填写相关信息，点击生成按钮获取策略。</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Globe className="w-32 h-32" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
