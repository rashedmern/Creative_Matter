import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Asterisk, ArrowRight, Settings, Monitor, Code, BarChart, 
  Palette, MessageSquare, Wrench, Menu, X, Calendar,
  Twitter, Instagram, Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <Asterisk className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight">Creative Matter</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('home')} className="text-sm font-medium hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollTo('services')} className="text-sm font-medium hover:text-primary transition-colors">Services</button>
            <button onClick={() => scrollTo('portfolio')} className="text-sm font-medium hover:text-primary transition-colors">Portfolio</button>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
            <Button className="rounded-full px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all border-none">Contact</Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border p-6 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollTo('home')} className="text-left py-2 text-lg font-medium hover:text-primary">Home</button>
            <button onClick={() => scrollTo('services')} className="text-left py-2 text-lg font-medium hover:text-primary">Services</button>
            <button onClick={() => scrollTo('portfolio')} className="text-left py-2 text-lg font-medium hover:text-primary">Portfolio</button>
            <Button className="mt-4 rounded-full bg-primary text-primary-foreground">Contact</Button>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section id="home" className="pt-40 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-start"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card mb-6">
                <Asterisk className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium uppercase tracking-wider">A Creative Agency</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] mb-6 tracking-tight">
                Design That Actually<br />
                <span className="text-primary">Matters.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed font-sans">
                We create digital experiences that blend aesthetic excellence with strategic purpose. Building brands that drive real business results.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-12">
                <Button size="lg" className="rounded-full h-14 px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all border-none">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-medium border-border hover:bg-secondary">
                  View Portfolio
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-8 w-full max-w-md">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-xs font-bold">JD</div>
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-700 flex items-center justify-center text-xs font-bold">AK</div>
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-600 flex items-center justify-center text-xs font-bold">MR</div>
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">+</div>
                </div>
                <div>
                  <p className="font-semibold text-sm">500+ satisfied clients</p>
                  <p className="text-xs text-muted-foreground">Join our growing community</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              
              {/* Mockup */}
              <div className="relative w-full aspect-square bg-card border border-border rounded-3xl overflow-hidden flex items-center justify-center p-6">
                <div className="w-full h-full border border-border/50 rounded-2xl bg-[#0D1117] flex flex-col shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
                  
                  <div className="h-10 border-b border-border/50 flex items-center px-4 gap-1.5 z-10 bg-background/50 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  
                  <div className="flex-1 p-8 flex flex-col gap-6 z-10">
                    <div className="w-1/3 h-8 bg-primary/20 rounded-lg" />
                    <div className="w-3/4 h-32 bg-secondary/50 rounded-xl" />
                    <div className="grid grid-cols-2 gap-6 mt-auto">
                      <div className="h-24 bg-primary/10 border border-primary/20 rounded-xl" />
                      <div className="h-24 bg-secondary/50 rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Floating Card */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 bottom-16 bg-card border border-border p-5 rounded-2xl shadow-xl flex items-start gap-4 z-20"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Free Consultation</h4>
                    <p className="text-xs text-muted-foreground mb-3">Discuss your next project</p>
                    <Button size="sm" className="h-8 text-xs rounded-full w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none">Book a slot</Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SERVICE PREVIEW CARDS */}
      <section className="pb-24 px-6 relative z-10 -mt-8 md:-mt-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Asterisk className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl mb-2">Design & Development</h3>
                <p className="text-muted-foreground text-sm font-sans">We craft beautiful, high-performing websites and digital products that stand out.</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all">
                <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl mb-2">Maintenance & Support</h3>
                <p className="text-muted-foreground text-sm font-sans">Ongoing optimization to ensure your digital presence is always performing at its best.</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all">
                <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. TRUST/STATS SECTION */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Our Impact</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight tracking-tight">
                Why Partners Trust<br />Creative Matter
              </h2>
              <p className="text-lg text-muted-foreground max-w-md font-sans">
                We've spent years refining our process to deliver exceptional results consistently. Our numbers speak for themselves, but our client relationships are what truly matter.
              </p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col gap-12">
              <div className="grid grid-cols-3 gap-6 divide-x divide-border">
                <div>
                  <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">15K<span className="text-primary">+</span></p>
                  <p className="text-sm text-muted-foreground font-medium">Subscribers</p>
                </div>
                <div className="pl-6">
                  <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">3K<span className="text-primary">+</span></p>
                  <p className="text-sm text-muted-foreground font-medium">Completed Projects</p>
                </div>
                <div className="pl-6">
                  <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">4.5<span className="text-primary">★</span></p>
                  <p className="text-sm text-muted-foreground font-medium">Client Reviews</p>
                </div>
              </div>
              
              <div className="w-full h-64 rounded-3xl bg-gradient-to-br from-card to-background border border-border relative overflow-hidden flex items-center justify-center group">
                <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-all duration-700"></div>
                <Asterisk className="w-32 h-32 text-border group-hover:text-primary/40 transition-colors duration-700" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TEAM/HELP SECTION */}
      <section className="py-24 px-6 bg-card border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="lg:col-span-7 rounded-[2rem] overflow-hidden aspect-[4/3] relative border border-border"
            >
              <img 
                src="/images/team.png" 
                alt="Creative Matter Team" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent mix-blend-multiply"></div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="lg:col-span-5 flex flex-col items-start"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight tracking-tight">
                See How We Can Help Your Business Grow
              </h2>
              <p className="text-lg text-muted-foreground mb-10 font-sans">
                Our multidisciplinary team brings together strategy, design, and technology to build brands that connect with audiences and drive measurable growth.
              </p>
              <Button size="lg" className="rounded-full px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. IMPACT STATS SECTION */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight tracking-tight">
                Attractive Minimalist Design for Modern Businesses
              </h2>
              <p className="text-lg text-muted-foreground font-sans">
                We believe that good design is as little design as possible. By stripping away the unnecessary, we focus on what truly matters to your users, resulting in interfaces that are intuitive, fast, and highly converting.
              </p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={fadeInUp} className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
                <p className="text-5xl font-display font-bold text-white mb-4">-45<span className="text-primary">%</span></p>
                <h4 className="font-display font-bold text-xl mb-2">Cost Reduction</h4>
                <p className="text-sm text-muted-foreground font-sans">Decreased development overhead through unified design systems.</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
                <p className="text-5xl font-display font-bold text-white mb-4">+20<span className="text-primary">%</span></p>
                <h4 className="font-display font-bold text-xl mb-2">Revenue Increase</h4>
                <p className="text-sm text-muted-foreground font-sans">Average conversion lift for our e-commerce and SaaS partners.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. SERVICES GRID */}
      <section id="services" className="py-24 px-6 bg-card">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
              Comprehensive digital solutions tailored to elevate your brand and drive your business forward.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: <Monitor className="w-6 h-6" />, title: "Web Design", desc: "Stunning, user-centric interfaces that captivate and convert." },
              { icon: <Code className="w-6 h-6" />, title: "Web Development", desc: "Robust, scalable, and blazingly fast digital products." },
              { icon: <BarChart className="w-6 h-6" />, title: "Digital Marketing", desc: "Data-driven strategies to expand your reach and ROI." },
              { icon: <Palette className="w-6 h-6" />, title: "Visual Identity", desc: "Cohesive brand systems that tell your unique story." },
              { icon: <MessageSquare className="w-6 h-6" />, title: "Consultation", desc: "Strategic guidance to navigate the digital landscape." },
              { icon: <Wrench className="w-6 h-6" />, title: "Web Maintenance", desc: "Proactive support to keep your platforms secure and updated." },
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-background border border-border p-8 rounded-3xl hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="font-display font-bold text-xl mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-sans">{service.desc}</p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="flex flex-col items-start mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary mb-6">
              <Asterisk className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Our Portfolio</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight">
              Beyond the Portfolio:<br />Your Project Awaits
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project 1 - Large */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="md:col-span-2 relative rounded-[2rem] overflow-hidden group aspect-[21/9] md:aspect-[21/8] bg-card border border-border/50"
            >
              <img 
                src="/images/portfolio-1.png" 
                alt="Pour la Parlor" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1600"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex items-end justify-between">
                <div>
                  <span className="text-primary font-medium text-sm tracking-wider mb-3 block">Branding & Packaging</span>
                  <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Pour la Parlor</h3>
                </div>
                <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowRight className="w-6 h-6 -rotate-45" />
                </div>
              </div>
            </motion.div>

            {/* Grid of smaller projects */}
            {[
              { img: "/images/portfolio-2.png", title: "Novel Music", cat: "UI/UX Design", fallback: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=800" },
              { img: "/images/portfolio-3.png", title: "Luxx Cat Min", cat: "Photography", fallback: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" },
              { img: "/images/portfolio-4.png", title: "Artis Coffee Mug", cat: "Product Design", fallback: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800" },
              { img: "/images/portfolio-5.png", title: "Antique Wind", cat: "Art Direction", fallback: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800" },
            ].map((proj, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="relative rounded-[2rem] overflow-hidden group aspect-[4/3] bg-card border border-border/50"
              >
                <img 
                  src={proj.img} 
                  alt={proj.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = proj.fallback; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between">
                  <div>
                    <span className="text-primary font-medium text-xs tracking-wider mb-2 block">{proj.cat}</span>
                    <h3 className="text-2xl font-display font-bold text-white tracking-tight">{proj.title}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-24 px-6 border-y border-border bg-card">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Kind Words from Great People</h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: "Ayaan R.", role: "CEO", company: "TechFlow", quote: "Their service is really good. The team understood our vision perfectly and delivered a product that exceeded all expectations." },
              { name: "Marquina B.", role: "Founder", company: "Aura Studio", quote: "This is the best agency we've worked with. Their attention to detail and creative approach sets them apart." },
              { name: "Anna K.", role: "Marketing Director", company: "Vanguard", quote: "I love the designs they produced. We've seen a massive increase in engagement since launching the new site." }
            ].map((t, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-background border border-border p-8 rounded-3xl flex flex-col">
                <div className="flex gap-1 mb-8 text-primary">
                  {[1,2,3,4,5].map(i => <Asterisk key={i} className="w-4 h-4" />)}
                </div>
                <p className="text-lg mb-10 flex-1 font-sans text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg border border-border">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8 tracking-tight">
              Ready to create<br />
              <span className="text-primary">something that</span><br />
              matters?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-sans">
              We're currently accepting new projects. Let's make your brand the next success story.
            </p>
            <Button size="lg" className="rounded-full h-16 px-10 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 border-none transition-all scale-100 hover:scale-105">
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-card border-t border-border pt-20 pb-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Asterisk className="w-8 h-8 text-primary" />
                <span className="font-display font-bold text-2xl tracking-tight">Creative Matter</span>
              </div>
              <p className="text-muted-foreground max-w-sm font-sans">
                A digital creative agency crafting experiences that matter for brands that want to stand out.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-sans">
                <li><a href="#" className="hover:text-primary transition-colors">Web Design</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Digital Marketing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Visual Identity</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-sans">
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-sans">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-sans">© {new Date().getFullYear()} Creative Matter. All rights reserved.</p>
            <div className="flex items-center gap-6 text-muted-foreground">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
