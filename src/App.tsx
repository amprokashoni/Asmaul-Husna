import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Share2, X, Download, Copy, BookOpen, ArrowLeft, Info, ArrowLeftRight } from 'lucide-react';
import { names, AllahName } from './constants';
import { nameDifferences, synAntData } from './extraData';

const toBN = (n: number | string) => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);

export default function App() {
  const [view, setView] = useState<'cover' | 'book' | 'memorize-ar' | 'memorize-bn' | 'diff' | 'syn-ant'>('cover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<AllahName | null>(null);
  const [modalTab, setModalTab] = useState<'card' | 'desc'>('card');
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setLogoImg(img);
    // Using the uploaded logo URL
    img.src = "https://storage.googleapis.com/static.ai.studio/build/input_file_0.png";
  }, []);

  const filteredNames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return names;
    return names.filter(d => 
      d.tr.toLowerCase().includes(q) || 
      d.mn.includes(q) || 
      d.desc.includes(q) || 
      d.ar.includes(q) || 
      toBN(d.n).includes(q) || 
      d.n.toString().includes(q)
    );
  }, [searchQuery]);

  const drawCard = (d: AllahName) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const SIZE = 1080;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // BG gradient
    const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bg.addColorStop(0, '#fdf6e3');
    bg.addColorStop(0.5, '#ffffff');
    bg.addColorStop(1, '#fdf6e3');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Geometric circles
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#004890';
    ctx.lineWidth = 1;
    [380, 480, 580].forEach(r => {
      ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, r, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.restore();

    // Corner ornaments
    const drawOrnament = (x: number, y: number, pos: number) => {
      ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#004890'; ctx.lineWidth = 1.5;
      const s = 40;
      ctx.beginPath();
      if (pos === 1) { ctx.moveTo(x, y + s); ctx.lineTo(x, y); ctx.lineTo(x + s, y); }
      else if (pos === 2) { ctx.moveTo(x - s, y); ctx.lineTo(x, y); ctx.lineTo(x, y + s); }
      else if (pos === 3) { ctx.moveTo(x, y - s); ctx.lineTo(x, y); ctx.lineTo(x + s, y); }
      else { ctx.moveTo(x - s, y); ctx.lineTo(x, y); ctx.lineTo(x, y - s); }
      ctx.stroke(); ctx.restore();
    };
    drawOrnament(60, 60, 1);
    drawOrnament(SIZE - 60, 60, 2);
    drawOrnament(60, SIZE - 60, 3);
    drawOrnament(SIZE - 60, SIZE - 60, 4);

    // Blue border frame
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
    };

    ctx.save();
    const brd = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    brd.addColorStop(0, '#004890');
    brd.addColorStop(0.5, '#0056b3');
    brd.addColorStop(1, '#003366');
    ctx.strokeStyle = brd;
    ctx.lineWidth = 3;
    roundRect(30, 30, SIZE - 60, SIZE - 60, 24);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    roundRect(38, 38, SIZE - 76, SIZE - 76, 20);
    ctx.stroke();
    ctx.restore();

    // Number badge
    ctx.save();
    const nbg = ctx.createLinearGradient(SIZE / 2 - 44, 72, SIZE / 2 + 44, 116);
    nbg.addColorStop(0, '#004890'); nbg.addColorStop(1, '#003366');
    ctx.fillStyle = nbg;
    roundRect(SIZE / 2 - 44, 72, 88, 44, 22);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 22px 'Noto Serif Bengali'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(toBN(d.n), SIZE / 2, 95);
    ctx.restore();

    // Arabic name
    ctx.save();
    ctx.fillStyle = '#004890';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const arSize = d.ar.length > 15 ? 72 : 96;
    ctx.font = `${arSize}px 'Amiri'`;
    ctx.shadowColor = 'rgba(0,72,144,0.2)';
    ctx.shadowBlur = 20;
    ctx.fillText(d.ar, SIZE / 2, 230);
    ctx.restore();

    // Transliteration
    ctx.save();
    ctx.fillStyle = '#003366';
    ctx.textAlign = 'center';
    ctx.font = `italic 30px 'Noto Serif Bengali'`;
    ctx.fillText(d.tr, SIZE / 2, 310);
    ctx.restore();

    // Divider line
    ctx.save();
    const dv = ctx.createLinearGradient(160, 350, SIZE - 160, 350);
    dv.addColorStop(0, 'transparent'); dv.addColorStop(0.5, '#004890'); dv.addColorStop(1, 'transparent');
    ctx.strokeStyle = dv; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(160, 350); ctx.lineTo(SIZE - 160, 350); ctx.stroke();
    ctx.restore();

    // Meaning
    ctx.save();
    ctx.fillStyle = '#003366';
    ctx.textAlign = 'center';
    ctx.font = `bold 38px 'Noto Serif Bengali'`;
    ctx.fillText('অর্থ: ' + d.mn, SIZE / 2, 410);
    ctx.restore();

    // Description (wrapped)
    const wrapText = (text: string, cx: number, y: number, maxW: number, lh: number) => {
      const words = text.split(' '); let line = '';
      for (let w of words) {
        const t = line ? line + ' ' + w : w;
        if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, cx, y); line = w; y += lh; }
        else line = t;
        if (y > 710) break;
      }
      if (line) ctx.fillText(line, cx, y);
    };
    ctx.save();
    ctx.fillStyle = '#003366';
    ctx.globalAlpha = 0.8;
    ctx.textAlign = 'center';
    ctx.font = `26px 'Noto Serif Bengali'`;
    wrapText(d.desc, SIZE / 2, 480, SIZE - 160, 38);
    ctx.restore();

    // Quran box
    const qy = 720;
    ctx.save();
    ctx.fillStyle = 'rgba(0,72,144,0.05)';
    ctx.strokeStyle = 'rgba(0,72,144,0.3)';
    ctx.lineWidth = 1.5;
    roundRect(100, qy, SIZE - 200, 130, 12);
    ctx.fill(); ctx.stroke();
    // left accent
    const acc = ctx.createLinearGradient(100, qy, 100, qy + 130);
    acc.addColorStop(0, '#004890'); acc.addColorStop(1, '#003366');
    ctx.fillStyle = acc;
    roundRect(100, qy, 6, 130, 3); ctx.fill();

    ctx.fillStyle = '#004890';
    ctx.font = `bold 20px 'Noto Serif Bengali'`;
    ctx.textAlign = 'left';
    ctx.fillText('📖 ' + d.qr, 124, qy + 30);
    ctx.fillStyle = '#003366';
    ctx.font = `italic 22px 'Noto Serif Bengali'`;
    const wrapTextLeft = (text: string, x: number, y: number, maxW: number, lh: number) => {
      const words = text.split(' '); let line = '';
      for (let w of words) {
        const t = line ? line + ' ' + w : w;
        if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; }
        else line = t;
        if (y > 860) break;
      }
      if (line) ctx.fillText(line, x, y);
    };
    wrapTextLeft('"' + d.q + '"', 124, qy + 62, SIZE - 240, 30);
    ctx.restore();

    // Branding
    ctx.save();
    ctx.fillStyle = 'rgba(0,72,144,0.08)';
    roundRect(SIZE / 2 - 220, SIZE - 115, 440, 70, 35);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,72,144,0.2)'; ctx.lineWidth = 1;
    roundRect(SIZE / 2 - 220, SIZE - 115, 440, 70, 35); ctx.stroke();
    
    if (logoImg) {
      const logoSize = 50;
      ctx.drawImage(logoImg, SIZE / 2 - 200, SIZE - 105, logoSize, logoSize);
      ctx.fillStyle = '#003366';
      ctx.font = `bold 22px 'Noto Serif Bengali'`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('আকিজ-মনোয়ারা প্রকাশনী', SIZE / 2 - 140, SIZE - 80);
    } else {
      ctx.fillStyle = '#003366';
      ctx.font = `bold 22px 'Noto Serif Bengali'`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('আকিজ-মনোয়ারা প্রকাশনী', SIZE / 2, SIZE - 80);
    }
    ctx.restore();

    // Bismillah top
    ctx.save();
    ctx.fillStyle = 'rgba(0,72,144,0.5)';
    ctx.font = `italic 22px 'Amiri'`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', SIZE / 2, 50);
    ctx.restore();
  };

  useEffect(() => {
    if (selectedName && modalTab === 'card') {
      setTimeout(() => drawCard(selectedName), 100);
    }
  }, [selectedName, modalTab, logoImg]);

  const handleCopy = () => {
    if (!selectedName) return;
    const txt = `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\n✨ আল্লাহর ৯৯ নাম — নাম #${selectedName.n}\n\n${selectedName.ar}\n${selectedName.tr}\nঅর্থ: ${selectedName.mn}\n\n${selectedName.desc}\n\n📖 ${selectedName.qr}\n"${selectedName.q}"\n\n─────────────────\n📚 আকিজ-মনোয়ারা প্রকাশনী\n#আসমাউলহুসনা #আল্লাহর৯৯নাম #IslamicPost #AsmaUlHusna`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setImgPreview(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {view === 'cover' ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cover flex-1 flex flex-col items-center justify-center text-center p-10 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #ffffff 100%)' }}
          >
            <div className="absolute w-[600px] h-[600px] rounded-full border border-[#004890]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-[#004890]/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            <div className="font-arabic text-3xl md:text-4xl text-[#004890] mb-6 md:mb-8 drop-shadow-[0_0_10px_rgba(0,72,144,0.2)] z-10">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
            <div className="text-[#004890] tracking-[8px] mb-4 z-10">✦ ✦ ✦</div>
            <div className="font-arabic text-4xl md:text-6xl text-[#004890] mb-6 md:mb-8 z-10">أَسْمَاءُ اللَّهِ الْحُسْنَى</div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#003366] leading-tight mb-4 z-10">
              আল্লাহর ৯৯ নাম<br />
              <span className="text-xl md:text-2xl text-[#004890]">আসমাউল হুসনা</span>
            </h1>
            <p className="text-sm md:text-lg text-[#004890] tracking-widest mb-6 md:mb-8 z-10 uppercase">
              আরবি • উচ্চারণ • অর্থ • বিবরণ • কুরআনের আয়াত
            </p>
            
            <div className="max-w-md text-xs md:text-sm text-[#003366]/70 leading-relaxed border-y border-[#004890]/30 py-4 mb-8 md:mb-10 z-10">
              রাসূলুল্লাহ ﷺ বলেছেন:<br />
              <em className="italic">"আল্লাহর ৯৯টি নাম রয়েছে — একশত বাদ এক। যে ব্যক্তি এগুলো আয়ত্ত করবে, সে জান্নাতে প্রবেশ করবে।"</em><br />
              <span className="text-[#004890]">— সহীহ বুখারী ও মুসলিম</span>
            </div>
            
            <div className="flex flex-col gap-4 z-10 w-full max-w-xs pb-20 md:pb-0">
              <button
                onClick={() => setView('book')}
                className="w-full px-10 py-4 bg-gradient-to-br from-[#004890] to-[#003366] rounded-full text-white font-bold text-lg shadow-lg shadow-[#004890]/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <BookOpen size={20} />
                আসমাউল হুসনা প্রবেশ করুন
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setView('memorize-ar')}
                  className="px-4 py-3 border border-[#004890]/40 rounded-2xl text-[#004890] font-semibold text-sm hover:bg-[#004890]/10 transition-all flex flex-col items-center gap-1"
                >
                  <span className="font-arabic text-lg">الأسماء</span>
                  মুখস্ত করুন (আরবী)
                </button>
                <button
                  onClick={() => setView('memorize-bn')}
                  className="px-4 py-3 border border-[#004890]/40 rounded-2xl text-[#004890] font-semibold text-sm hover:bg-[#004890]/10 transition-all flex flex-col items-center gap-1"
                >
                  <span className="text-lg">নামসমূহ</span>
                  মুখস্ত করুন (বাংলা)
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setView('diff')}
                  className="w-full px-6 py-3 border border-[#004890]/40 rounded-2xl text-[#004890] font-semibold text-sm hover:bg-[#004890]/10 transition-all flex items-center justify-center gap-2"
                >
                  <Info size={16} />
                  একই অর্থবোধক নামের পার্থক্য
                </button>
                <button
                  onClick={() => setView('syn-ant')}
                  className="w-full px-6 py-3 border border-[#004890]/40 rounded-2xl text-[#004890] font-semibold text-sm hover:bg-[#004890]/10 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeftRight size={16} />
                  সমার্থক ও বিপরীতার্থক নাম
                </button>
              </div>
            </div>
          </motion.div>
        ) : view === 'book' ? (
          <motion.div
            key="book"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col bg-[#fdf6e3]"
          >
            <header className="sticky top-0 z-50 bg-[#004890] border-b-2 border-[#003366] px-4 md:px-10 py-3 md:py-4 flex justify-between items-center">
              <button
                onClick={() => setView('cover')}
                className="flex items-center gap-2 px-3 md:px-4 py-2 border border-white/50 rounded-full text-white text-xs md:text-sm hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">প্রচ্ছদে ফিরুন</span>
                <span className="sm:hidden">ফিরুন</span>
              </button>
              <h2 className="text-sm md:text-lg text-white font-semibold truncate max-w-[150px] md:max-w-none">আল্লাহর ৯৯ নাম</h2>
              <div className="text-white/80 text-xs md:text-sm font-medium">
                {toBN(names.length)}টি নাম
              </div>
            </header>

            <div className="bg-[#fdf6e3] px-4 md:px-10 py-6 border-b border-[#004890]/10">
              <div className="relative max-w-4xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003366]/40" size={20} />
                <input
                  type="text"
                  placeholder="নাম, উচ্চারণ বা অর্থ দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-white border border-[#004890]/30 rounded-full text-[#003366] focus:outline-none focus:border-[#004890] transition-colors"
                />
              </div>
            </div>

            <main className="flex-1 px-4 md:px-10 py-6 md:py-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNames.length > 0 ? (
                  filteredNames.map((name) => (
                    <motion.div
                      layout
                      key={name.n}
                      onClick={() => setSelectedName(name)}
                      className="bg-white border border-[#004890]/20 rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-[#004890]/50 hover:shadow-xl transition-all group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#004890]" />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 bg-[#004890] rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {toBN(name.n)}
                        </div>
                        <div className="text-right">
                          <span className="font-arabic text-4xl text-[#004890] block leading-tight">{name.ar}</span>
                          <span className="text-sm text-[#003366]/60 italic block mt-1">{name.tr}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-[#003366] mb-2">{name.mn}</h3>
                      <p className="text-sm text-[#003366]/70 leading-relaxed border-t border-[#004890]/10 pt-4 mb-4 line-clamp-3">
                        {name.desc}
                      </p>
                      
                      <div className="bg-[#004890]/5 border-l-2 border-[#004890] rounded-lg p-3 text-xs text-[#003366]/80 leading-relaxed mb-4">
                        <span className="block font-bold text-[#004890] mb-1">📖 {name.qr}</span>
                        {name.q}
                      </div>
                      
                      <button className="w-full py-2 bg-[#004890]/10 border border-[#004890]/30 rounded-lg text-[#004890] text-sm font-medium hover:bg-[#004890]/20 transition-colors flex items-center justify-center gap-2">
                        <Share2 size={16} />
                        ফটোকার্ড ও শেয়ার
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-[#003366]/40">
                    কোনো নাম পাওয়া যায়নি।
                  </div>
                )}
              </div>
            </main>

            <footer className="text-center py-8 text-[#003366]/40 text-sm border-t border-[#004890]/10">
              আল্লাহর সকল নাম পবিত্র ও মহিমান্বিত • আকিজ-মনোয়ারা প্রকাশনী
            </footer>
          </motion.div>
        ) : view === 'diff' ? (
          <motion.div
            key="diff"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-[#fdf6e3]"
          >
            <header className="sticky top-0 z-50 bg-[#004890] border-b border-[#003366]/30 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => setView('cover')}
                className="flex items-center gap-2 px-4 py-2 border border-white/50 rounded-full text-white text-sm hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={16} />
                ফিরে যান
              </button>
              <h2 className="text-lg text-white font-semibold">একই অর্থবোধক নামের পার্থক্য</h2>
              <div className="w-24" />
            </header>

            <main className="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full pb-24 md:pb-10">
              <div className="space-y-8">
                {nameDifferences.map((group, idx) => (
                  <div key={idx} className="bg-white border border-[#004890]/30 rounded-3xl overflow-hidden shadow-xl">
                    <div className="bg-[#004890] px-6 py-3 text-white font-bold text-lg">
                      {group.title}
                    </div>
                    <div className="p-6 space-y-6">
                      {group.items.map((item, i) => (
                        <div key={i} className="border-l-4 border-[#004890] pl-4">
                          <h3 className="text-[#004890] font-bold text-xl mb-1">{item.name}</h3>
                          <p className="text-[#003366] font-medium mb-2">অর্থ: {item.meaning}</p>
                          <p className="text-[#003366]/70 text-sm leading-relaxed">{item.nuance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </motion.div>
        ) : view === 'syn-ant' ? (
          <motion.div
            key="syn-ant"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-[#fdf6e3]"
          >
            <header className="sticky top-0 z-50 bg-[#004890] border-b border-[#003366]/30 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => setView('cover')}
                className="flex items-center gap-2 px-4 py-2 border border-white/50 rounded-full text-white text-sm hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={16} />
                ফিরে যান
              </button>
              <h2 className="text-lg text-white font-semibold">সমার্থক ও বিপরীতার্থক নাম</h2>
              <div className="w-24" />
            </header>

            <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full pb-24 md:pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Synonyms Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-[#004890]/20 pb-4">
                    <div className="w-10 h-10 bg-[#004890] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#004890]/20">
                      <ArrowLeftRight size={20} />
                    </div>
                    <div>
                      <h3 className="text-[#004890] font-bold text-xl">সমার্থক নামসমূহ</h3>
                      <p className="text-[#003366]/50 text-xs uppercase tracking-wider">একই অর্থবোধক নামসমূহ</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {synAntData.filter(d => d.type === 'synonym').map((item, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ y: -2 }}
                        className="bg-white border border-[#004890]/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <ArrowLeftRight size={40} className="text-[#004890]" />
                        </div>
                        <div className="flex items-center justify-between text-[#004890] font-bold text-lg mb-3 relative z-10">
                          <div className="flex flex-col">
                            <span className="text-xs text-[#003366]/40 font-medium mb-1">নাম ১</span>
                            <span>{item.pair[0]}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#004890]/5 flex items-center justify-center text-[#004890]/30 italic text-sm">
                            &
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-xs text-[#003366]/40 font-medium mb-1">নাম ২</span>
                            <span>{item.pair[1]}</span>
                          </div>
                        </div>
                        <div className="bg-[#fdf6e3] rounded-xl p-3 border border-[#004890]/5">
                          <p className="text-[#003366]/70 text-sm leading-relaxed">
                            <span className="font-bold text-[#004890]">মূলভাব:</span> {item.meaning}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Antonyms Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-[#003366]/20 pb-4">
                    <div className="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#003366]/20">
                      <ArrowLeftRight size={20} className="rotate-90" />
                    </div>
                    <div>
                      <h3 className="text-[#003366] font-bold text-xl">বিপরীতার্থক নামসমূহ</h3>
                      <p className="text-[#003366]/50 text-xs uppercase tracking-wider">পরস্পর বিপরীত গুণাবলী</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {synAntData.filter(d => d.type === 'antonym').map((item, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ y: -2 }}
                        className="bg-white border border-[#003366]/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <ArrowLeftRight size={40} className="text-[#003366] rotate-90" />
                        </div>
                        <div className="flex items-center justify-between text-[#003366] font-bold text-lg mb-3 relative z-10">
                          <div className="flex flex-col">
                            <span className="text-xs text-[#003366]/40 font-medium mb-1">নাম ১</span>
                            <span className="text-[#004890]">{item.pair[0]}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#003366]/5 flex items-center justify-center">
                            <ArrowLeftRight size={16} className="text-[#003366]/30" />
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-xs text-[#003366]/40 font-medium mb-1">নাম ২</span>
                            <span className="text-[#003366]">{item.pair[1]}</span>
                          </div>
                        </div>
                        <div className="bg-[#fdf6e3] rounded-xl p-3 border border-[#003366]/5">
                          <p className="text-[#003366]/70 text-sm leading-relaxed">
                            <span className="font-bold text-[#003366]">বিষয়:</span> {item.meaning}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="memorize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-[#fdf6e3]"
          >
            <header className="sticky top-0 z-50 bg-[#004890] border-b border-[#003366]/30 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => setView('cover')}
                className="flex items-center gap-2 px-4 py-2 border border-white/50 rounded-full text-white text-sm hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={16} />
                ফিরে যান
              </button>
              <h2 className="text-lg text-white font-semibold">
                আল্লাহর ৯৯ নাম — {view === 'memorize-ar' ? 'আরবী' : 'বাংলা'}
              </h2>
              <div className="w-24" />
            </header>

            <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full pb-24 md:pb-10">
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-[#004890]/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#004890] to-transparent opacity-30" />
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#004890] to-transparent opacity-30" />
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-0 border border-[#003366]/10">
                  {names.map((name) => (
                    <div
                      key={name.n}
                      className="aspect-square flex flex-col items-center justify-center p-2 border border-[#003366]/10 hover:bg-[#004890]/5 transition-colors group relative"
                    >
                      <span className="absolute top-1 left-1 text-[8px] text-[#003366]/30 font-bold">
                        {toBN(name.n)}
                      </span>
                      {view === 'memorize-ar' ? (
                        <span className="font-arabic text-xl md:text-2xl text-[#003366] leading-none">
                          {name.ar}
                        </span>
                      ) : (
                        <span className="text-xs md:text-sm text-[#003366] font-bold text-center leading-tight">
                          {name.tr}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="aspect-square flex items-center justify-center p-2 border border-[#003366]/10 bg-[#004890]/5">
                    <span className="font-arabic text-3xl text-[#004890]">الله</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center text-[#003366]/40 text-sm italic">
                * এই তালিকাটি আপনাকে নামগুলো মুখস্ত করতে সাহায্য করবে। বিস্তারিত জানতে নামের কার্ডে ক্লিক করুন।
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#004890] border-t border-[#003366]/30 px-2 py-2 flex justify-around items-center">
        <button
          onClick={() => setView('cover')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'cover' ? 'text-white bg-white/10' : 'text-white/60'}`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <X size={20} className={view === 'cover' ? 'rotate-45' : ''} />
          </div>
          <span className="text-[10px] mt-1 font-medium">হোম</span>
        </button>
        <button
          onClick={() => setView('book')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'book' ? 'text-white bg-white/10' : 'text-white/60'}`}
        >
          <BookOpen size={20} />
          <span className="text-[10px] mt-1 font-medium">নামসমূহ</span>
        </button>
        <button
          onClick={() => setView('memorize-ar')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view.startsWith('memorize') ? 'text-white bg-white/10' : 'text-white/60'}`}
        >
          <div className="font-arabic text-sm leading-none">الأسماء</div>
          <span className="text-[10px] mt-1 font-medium">মুখস্ত</span>
        </button>
        <button
          onClick={() => setView('diff')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'diff' ? 'text-white bg-white/10' : 'text-white/60'}`}
        >
          <Info size={20} />
          <span className="text-[10px] mt-1 font-medium">পার্থক্য</span>
        </button>
        <button
          onClick={() => setView('syn-ant')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'syn-ant' ? 'text-white bg-white/10' : 'text-white/60'}`}
        >
          <ArrowLeftRight size={20} />
          <span className="text-[10px] mt-1 font-medium">সমার্থক</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedName && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedName(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative w-full h-full md:h-auto md:max-w-2xl bg-[#fdf6e3] md:border md:border-[#004890]/30 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex border-b border-[#004890]/20 sticky top-0 bg-[#fdf6e3] z-10">
                <button
                  onClick={() => setModalTab('card')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${modalTab === 'card' ? 'text-[#004890] bg-[#004890]/5 border-b-2 border-[#004890]' : 'text-[#003366]/60 hover:text-[#004890]'}`}
                >
                  📷 ফটোকার্ড
                </button>
                <button
                  onClick={() => setModalTab('desc')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${modalTab === 'desc' ? 'text-[#004890] bg-[#004890]/5 border-b-2 border-[#004890]' : 'text-[#003366]/60 hover:text-[#004890]'}`}
                >
                  📝 ক্যাপশন
                </button>
                <button 
                  onClick={() => setSelectedName(null)}
                  className="px-4 text-[#003366]/60 hover:text-[#004890] md:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                {modalTab === 'card' ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#004890]/10">
                      <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                    {imgPreview && (
                      <motion.img
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        src={imgPreview}
                        alt="Preview"
                        className="w-full max-w-md rounded-2xl border border-[#004890]/30"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white border border-[#004890]/20 rounded-2xl p-6 text-sm text-[#003366] leading-relaxed whitespace-pre-wrap font-mono">
                      {`بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\n✨ আল্লাহর ৯৯ নাম — নাম #${selectedName.n}\n\n${selectedName.ar}\n${selectedName.tr}\nঅর্থ: ${selectedName.mn}\n\n${selectedName.desc}\n\n📖 ${selectedName.qr}\n"${selectedName.q}"\n\n─────────────────\n📚 আকিজ-মনোয়ারা প্রকাশনী\n#আসমাউলহুসনা #আল্লাহর৯৯নাম #IslamicPost #AsmaUlHusna`}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`self-end px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${copied ? 'bg-emerald-600 text-white' : 'bg-gradient-to-br from-[#004890] to-[#003366] text-white'}`}
                    >
                      {copied ? <><X size={16} /> কপি হয়েছে!</> : <><Copy size={16} /> কপি করুন</>}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 flex gap-4">
                <button
                  onClick={generatePreview}
                  className="flex-1 py-3 bg-gradient-to-br from-[#004890] to-[#003366] rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Download size={18} />
                  ইমেজ দেখুন / সেভ করুন
                </button>
                <button
                  onClick={() => {
                    setSelectedName(null);
                    setImgPreview(null);
                  }}
                  className="px-6 py-3 border border-[#004890]/30 rounded-xl text-[#004890] font-bold text-sm hover:bg-[#004890]/10 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
              
              {imgPreview && (
                <div className="px-6 pb-6 text-center text-xs text-[#004890] animate-pulse">
                  👆 ছবির উপর দীর্ঘ চাপ দিন (মোবাইল) অথবা ডান ক্লিক → Save Image As (PC)
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
