import { Link } from 'react-router-dom'
import HeaderMember from '../../components/layout/HeaderMember';

function WeeklyMenu() {
  return (
    <>
      {/* 1. Header-LoggedIn (Fixed 64px, 'Weekly Menu' active) */}
      <HeaderMember />
      {/* Main Content Container */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-6 py-10 space-y-12">
        {/* Page Title & Introduction */}
        <div className="text-left space-y-2">
          <h1 className="font-fraunces text-3xl md:text-4xl font-semibold text-text-charcoal tracking-tight">
            BMI Calculator & Weekly Menu
          </h1>
          <p className="text-[17px] text-text-stem-gray max-w-2xl">
            Track your body metrics and discover personalized 7-day plant-based menus balanced with wholesome nutrition.
          </p>
        </div>
        {/* Top Section: BMI Calculator Form & Dietary Context */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-surface-paper border border-border-sage-mist rounded-xl p-6 lg:p-8 space-y-6">
              <div className="border-b border-border-sage-mist pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-[3px] h-4 bg-primary-moss inline-block rounded-full"></span>
                  <span className="text-xs font-medium text-text-stem-gray tracking-wider uppercase">
                    Body Metrics
                  </span>
                </div>
                <h2 className="font-fraunces text-xl md:text-2xl font-medium text-text-charcoal">
                  Enter Body Measurements
                </h2>
                <p className="text-[13px] text-text-stem-gray mt-1">
                  Provide basic physical parameters for tailored nutritional calculation
                </p>
              </div>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-text-stem-gray">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <input className="w-full bg-transparent border-2 border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] focus:outline-none focus:border-[#2F5233] focus:ring-0 transition-colors pr-12 font-medium" placeholder="Enter cm" type="number" value="165" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-stem-gray">
                        cm
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-text-stem-gray">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <input className="w-full bg-transparent border-2 border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] focus:outline-none focus:border-[#2F5233] focus:ring-0 transition-colors pr-12 font-medium" placeholder="Enter kg" type="number" value="58" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-stem-gray">
                        kg
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-text-stem-gray">
                      Age
                    </label>
                    <div className="relative">
                      <input className="w-full bg-transparent border-2 border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] focus:outline-none focus:border-[#2F5233] focus:ring-0 transition-colors pr-12 font-medium" placeholder="Enter age" type="number" value="28" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-stem-gray">
                        years
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-text-stem-gray">
                      Biological Sex
                    </label>
                    <div className="relative w-full">
                      <button className="w-full flex items-center justify-between bg-transparent border-2 border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] focus:outline-none focus:border-[#2F5233] focus:ring-0 transition-colors cursor-pointer" id="gender-btn" type="button">
                        <span className="" id="gender-text">
                          Male
                        </span>
                        <svg className="w-4 h-4 text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </button>
                      <ul className="hidden absolute left-0 top-full mt-1 w-full z-[60] bg-surface-paper border border-sage-mist rounded-lg shadow-md overflow-hidden" id="gender-menu">
                        <li className="px-4 py-2 text-charcoal hover:bg-herb-white hover:text-primary-moss cursor-pointer transition-colors">
                          Male
                        </li>
                        <li className="px-4 py-2 text-charcoal hover:bg-herb-white hover:text-primary-moss cursor-pointer transition-colors">
                          Female
                        </li>
                        <li className="px-4 py-2 text-charcoal hover:bg-herb-white hover:text-primary-moss cursor-pointer transition-colors">
                          Other
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 cursor-pointer select-none text-xs text-text-stem-gray">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input checked className="w-4 h-4 rounded border-border-sage-mist text-primary-moss focus:ring-primary-moss/30" type="checkbox" />
                    <span className="">
                      Auto-sync with personal profile
                    </span>
                  </label>
                </div>
                {/* Nutritional Target Dashboard (replaces basic alert box) */}
                <div className="bg-[#F3F6EE] border border-[#DCE3D5] rounded-xl p-5 flex flex-col gap-4 mt-6">
                  {/* Top row: BMI Score & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#6B6F63] font-medium uppercase tracking-wider block">
                        BMI SCORE
                      </span>
                      <span className="font-['Libre_Caslon_Text',serif] text-3xl font-bold text-[#2F5233] leading-none mt-0.5 block">
                        21.3
                      </span>
                    </div>
                    <span className="bg-[#2F5233]/10 text-[#2F5233] border border-[#2F5233]/20 px-3 py-1 rounded-full text-xs font-semibold">
                      Normal Weight
                    </span>
                  </div>
                  {/* Middle row: Visual BMI Scale Bar with pointer */}
                  <div className="space-y-1">
                    <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-amber-300 via-[#4C8C4A] to-[#C1432E] flex items-center">
                      <div className="absolute left-[35%] -top-0.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2F5233] shadow-xs"></div>
                    </div>
                    <div className="text-[10px] text-[#6B6F63] flex justify-between px-8 mt-1 font-medium">
                      <span className="">
                        18.5
                      </span>
                      <span className="">
                        24.9
                      </span>
                    </div>
                  </div>
                  {/* Bottom row: Macros Breakdown */}
                  <div>
                    <div className="text-xs font-semibold text-[#2B2A25] mb-2">
                      Daily Target: 1,850 kcal
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="border-t-2 border-[#D9A441] pt-1.5 bg-[#FDFBF6] rounded-b-md p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <div className="font-bold text-[#2B2A25] text-sm leading-tight">
                          55%
                        </div>
                        <div className="text-[11px] text-[#6B6F63] font-medium">
                          Carbs
                        </div>
                      </div>
                      <div className="border-t-2 border-[#2F5233] pt-1.5 bg-[#FDFBF6] rounded-b-md p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <div className="font-bold text-[#2F5233] text-sm leading-tight">
                          20%
                        </div>
                        <div className="text-[11px] text-[#6B6F63] font-medium">
                          Protein
                        </div>
                      </div>
                      <div className="border-t-2 border-[#A63446] pt-1.5 bg-[#FDFBF6] rounded-b-md p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <div className="font-bold text-[#A63446] text-sm leading-tight">
                          25%
                        </div>
                        <div className="text-[11px] text-[#6B6F63] font-medium">
                          Fat
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="lg:col-span-6 bg-surface-paper border border-border-sage-mist rounded-xl p-6 lg:p-8 space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="border-b border-border-sage-mist pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-[3px] h-4 bg-accent-turmeric inline-block rounded-full"></span>
                    <span className="text-xs font-medium text-text-stem-gray tracking-wider uppercase">
                      Dietary Preferences
                    </span>
                  </div>
                  <h2 className="font-fraunces text-xl md:text-2xl font-medium text-text-charcoal">
                    Dietary & Pantry Context
                  </h2>
                  <p className="text-[13px] text-text-stem-gray mt-1">
                    Specify ingredients to exclude or pantry items to prioritize for this week's plan.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-text-stem-gray">
                      Allergies & Exclusions
                    </label>
                    <div className="relative">
                      <input className="w-full bg-transparent border-2 border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] focus:outline-none focus:border-[#2F5233] focus:ring-0 transition-colors font-medium placeholder:text-text-stem-gray/70" id="allergy-input" placeholder="Type an ingredient and press Enter..." type="text" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4" id="selected-allergies-container"></div>
                    <div className="mt-2 pt-1 border-t border-border-sage-mist/60">
                      <div className="text-xs text-text-stem-gray font-medium mb-1.5">
                        Common exclusions:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button className="allergy-quick-btn bg-herb-white text-stem-gray border border-transparent px-3 py-1 rounded-full text-sm cursor-pointer transition-colors" type="button">
                          Gluten
                        </button>
                        <button className="allergy-quick-btn bg-herb-white text-stem-gray border border-transparent px-3 py-1 rounded-full text-sm cursor-pointer transition-colors" type="button">
                          Soy
                        </button>
                        <button className="allergy-quick-btn bg-herb-white text-stem-gray border border-transparent px-3 py-1 rounded-full text-sm cursor-pointer transition-colors" type="button">
                          Peanuts
                        </button>
                        <button className="allergy-quick-btn bg-herb-white text-stem-gray border border-transparent px-3 py-1 rounded-full text-sm cursor-pointer transition-colors" type="button">
                          Tree Nuts
                        </button>
                        <button className="allergy-quick-btn bg-herb-white text-stem-gray border border-transparent px-3 py-1 rounded-full text-sm cursor-pointer transition-colors" type="button">
                          Allium (Onion/Garlic)
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-text-stem-gray">
                      Pantry items to use up
                    </label>
                    <textarea className="w-full bg-transparent border-2 border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] focus:outline-none focus:border-[#2F5233] focus:ring-0 transition-colors resize-none font-normal leading-relaxed" placeholder="e.g. Firm tofu, 2 carrots, king oyster mushrooms, fresh ginger..." rows="2">
                      Firm tofu, fresh ginger, shiitake mushrooms, carrots
                    </textarea>
                    <div className="mt-2.5">
                      <div className="text-xs text-text-stem-gray font-medium mb-1.5">
                        Quick add staples:
                      </div>
                      <div className="max-h-40 overflow-y-auto pr-2 space-y-3.5 mt-2">
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-text-stem-gray font-medium uppercase tracking-wider">
                            Plant Proteins
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <button className="bg-primary-moss text-white border border-primary-moss px-3 py-1 rounded-full text-xs cursor-pointer font-medium" type="button">
                              Firm Tofu
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Silken Tofu
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Tempeh
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Chickpeas
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Lentils
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Edamame
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-text-stem-gray font-medium uppercase tracking-wider">
                            Fresh Produce
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <button className="bg-primary-moss text-white border border-primary-moss px-3 py-1 rounded-full text-xs cursor-pointer font-medium" type="button">
                              Shiitake
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Oyster Mushrooms
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Spinach
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Bok Choy
                            </button>
                            <button className="bg-primary-moss text-white border border-primary-moss px-3 py-1 rounded-full text-xs cursor-pointer font-medium" type="button">
                              Carrots
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Lotus Root
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-text-stem-gray font-medium uppercase tracking-wider">
                            Carbs & Bases
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Brown Rice
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Rice Noodles
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Sweet Potato
                            </button>
                            <button className="bg-surface-paper border border-border-sage-mist text-text-charcoal px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-moss transition-colors" type="button">
                              Quinoa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-moss/10 text-primary-moss flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-charcoal">
                  Ready to regenerate your weekly menu?
                </h3>
                <p className="text-xs text-text-stem-gray">
                  AI will adapt recipes to your 21.3 BMI target and pantry availability.
                </p>
              </div>
            </div>
            <button className="w-full sm:w-auto h-11 px-8 rounded-lg bg-primary-moss hover:bg-primary-moss-hover text-white text-[15px] font-medium transition-colors inline-flex items-center justify-center gap-2 flex-shrink-0 shadow-sm" type="button">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              </svg>
              <span className="">
                Generate AI Menu
              </span>
            </button>
          </div>
        </section>
        {/* Bottom Section: 7-Day Plant-Based Weekly Menu */}
        <section className="space-y-6">
          {/* Header & Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-sage-mist pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-[3px] h-4 bg-primary-moss inline-block rounded-full"></span>
                <span className="text-xs font-medium text-text-stem-gray tracking-wider uppercase">
                  AI Nutritional Plan
                </span>
              </div>
              <h2 className="font-fraunces text-2xl md:text-3xl font-semibold text-[#2B2A25] tracking-tight">
                Your Personalized Plant-Based Menu
              </h2>
              <p className="text-[14px] text-[#6B6F63]">
                AI-curated 7-day culinary plan balanced for your calculated BMI and nutritional profile.
              </p>
            </div>
            <div>
              <button className="h-10 px-4 rounded-lg border border-primary-moss text-primary-moss hover:bg-herb-white text-sm font-medium transition-colors inline-flex items-center gap-2" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Menu
              </button>
            </div>
          </div>
          {/* Weekday Navigation (Underline Tabs) */}
          <div className="border-b border-border-sage-mist overflow-x-auto">
            <div className="flex items-center space-x-6 min-w-max pb-[-1px]">
              <button className="pb-3 text-[15px] font-semibold text-[#2F5233] border-b-2 border-primary-moss flex items-center gap-2 focus:outline-none">
                <span className="">
                  Monday
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-primary-moss/10 text-primary-moss font-normal">
                  Today
                </span>
              </button>
              <button className="pb-3 text-[15px] font-medium text-[#6B6F63] hover:text-[#2B2A25] border-b-2 border-transparent hover:border-border-sage-mist transition-colors focus:outline-none">
                Tuesday
              </button>
              <button className="pb-3 text-[15px] font-medium text-[#6B6F63] hover:text-[#2B2A25] border-b-2 border-transparent hover:border-border-sage-mist transition-colors focus:outline-none">
                Wednesday
              </button>
              <button className="pb-3 text-[15px] font-medium text-[#6B6F63] hover:text-[#2B2A25] border-b-2 border-transparent hover:border-border-sage-mist transition-colors focus:outline-none">
                Thursday
              </button>
              <button className="pb-3 text-[15px] font-medium text-[#6B6F63] hover:text-[#2B2A25] border-b-2 border-transparent hover:border-border-sage-mist transition-colors focus:outline-none">
                Friday
              </button>
              <button className="pb-3 text-[15px] font-medium text-[#6B6F63] hover:text-[#2B2A25] border-b-2 border-transparent hover:border-border-sage-mist transition-colors focus:outline-none">
                Saturday
              </button>
              <button className="pb-3 text-[15px] font-medium text-[#6B6F63] hover:text-[#2B2A25] border-b-2 border-transparent hover:border-border-sage-mist transition-colors focus:outline-none">
                Sunday
              </button>
            </div>
          </div>
          {/* Daily Meals Grid (Breakfast, Lunch, Dinner) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breakfast Card */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 flex flex-col justify-between transition-colors duration-200 hover:border-primary-moss cursor-pointer group">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-[3px] h-3.5 bg-primary-moss inline-block rounded-full"></span>
                    <span className="text-xs font-bold text-primary-moss tracking-wider uppercase">
                      Breakfast
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-text-stem-gray hover:text-primary-moss px-2 py-1 rounded bg-herb-white hover:bg-border-sage-mist/50 transition-colors focus:outline-none" title="Swap meal" type="button">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="">
                      Swap
                    </span>
                  </button>
                </div>
                <img alt="Warm Steamed Silken Tofu with Ginger & Scallions" className="w-full h-32 object-cover rounded-md mt-3 mb-3.5 border border-border-sage-mist group-hover:opacity-95 transition-opacity" src="https://lh3.googleusercontent.com/aida/AEtjO1WKcDwGR2GO1h8uT61hNF-s_62zOYXjY8wzlx8-YVN9qcyiWrINEaKUq1DV-gcQ-G7syVZEwHgyWph99ZzTpvTqJOjzjemUgHoHjo3bb00YP4VDdU3xDibxsswo6LbTzG4g7QCyuSTjBB8Y_0mQ57bOen8CA2NXIAsnJwC0eevQaGHA0yF_XXpq9R37yeuGktzM_K2CU24bUaiE8ADGempXrmLk1iKtN9tkU23B4jXFT560t4_50GAzSLI" />
                <div className="space-y-2">
                  <h3 className="font-fraunces font-semibold text-text-charcoal text-base leading-snug group-hover:text-primary-moss transition-colors">
                    Warm Steamed Silken Tofu with Ginger & Scallions
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      340 kcal
                    </span>
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      18g Protein
                    </span>
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      15m Prep
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3.5 border-t border-border-sage-mist flex items-center justify-between text-[13px] text-text-stem-gray group-hover:text-primary-moss transition-colors">
                <span className="font-medium">
                  View recipe detail
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
            {/* Lunch Card */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 flex flex-col justify-between transition-colors duration-200 hover:border-primary-moss cursor-pointer group">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-[3px] h-3.5 bg-accent-turmeric inline-block rounded-full"></span>
                    <span className="text-xs font-bold text-primary-moss tracking-wider uppercase">
                      Lunch
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-text-stem-gray hover:text-primary-moss px-2 py-1 rounded bg-herb-white hover:bg-border-sage-mist/50 transition-colors focus:outline-none" title="Swap meal" type="button">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="">
                      Swap
                    </span>
                  </button>
                </div>
                <img alt="Claypot Braised King Oyster Mushrooms with Peppercorns" className="w-full h-32 object-cover rounded-md mt-3 mb-3.5 border border-border-sage-mist group-hover:opacity-95 transition-opacity" src="https://lh3.googleusercontent.com/aida/AEtjO1XzWa2CLI5VpF6lv2Se2NFKuKMJhpurIjsEnRdbq0Qq8yLg5eWbrGzs7a2Q7P-7F4b-DlE0CCNDOepbIKgjqFO3IgTO8q0pIDTmZInCz933PUbUywI62QpWlglFnYOJmyoDZW46J0CStifGdW4gHWI__lBUngz1XVw2eGFdoDb9lzox8d2q2wUq2mtH1O8YUHuLzyQt7Yx3BeprIhMpIhkhq2_xsTujcZDzuSu9NUUzAvBD8XUBnPE4rEM" />
                <div className="space-y-2">
                  <h3 className="font-fraunces font-semibold text-text-charcoal text-base leading-snug group-hover:text-primary-moss transition-colors">
                    Claypot Braised King Oyster Mushrooms with Peppercorns
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      520 kcal
                    </span>
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      24g Protein
                    </span>
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      25m Cook
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3.5 border-t border-border-sage-mist flex items-center justify-between text-[13px] text-text-stem-gray group-hover:text-primary-moss transition-colors">
                <span className="font-medium">
                  View recipe detail
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
            {/* Dinner Card */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 flex flex-col justify-between transition-colors duration-200 hover:border-primary-moss cursor-pointer group">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-[3px] h-3.5 bg-primary-moss inline-block rounded-full"></span>
                    <span className="text-xs font-bold text-primary-moss tracking-wider uppercase">
                      Dinner
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-text-stem-gray hover:text-primary-moss px-2 py-1 rounded bg-herb-white hover:bg-border-sage-mist/50 transition-colors focus:outline-none" title="Swap meal" type="button">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="">
                      Swap
                    </span>
                  </button>
                </div>
                <img alt="Lotus Root & Sweet Corn Herbal Broth" className="w-full h-32 object-cover rounded-md mt-3 mb-3.5 border border-border-sage-mist group-hover:opacity-95 transition-opacity" src="https://lh3.googleusercontent.com/aida/AEtjO1Ude7R11IRRpW2c9kLST45kXxemd6HOkh2-3ywiA-NEd9BFFlae2UOlQHWXuk8S78GKCMsukyOUOynA_N7Gc8U60OoApLxfzXOb9RBn6H42RsA04OziYAc7bo40OIuNe7Emdbspcw0hZJQRJbAPUgroKPHCVnlWmVNeqHAdF1WUaI2X1SuwQx4vr4ktGCK0_PO0JMuaPKkRxeDk4r9CkBCLZgNvgxaa5yWnXS9OHik61nlauWRd5Zn2Bhc" />
                <div className="space-y-2">
                  <h3 className="font-fraunces font-semibold text-text-charcoal text-base leading-snug group-hover:text-primary-moss transition-colors">
                    Lotus Root & Sweet Corn Herbal Broth
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      410 kcal
                    </span>
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      16g Protein
                    </span>
                    <span className="bg-herb-white text-text-stem-gray text-xs font-medium px-2.5 py-1 rounded-md">
                      30m Simmer
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3.5 border-t border-border-sage-mist flex items-center justify-between text-[13px] text-text-stem-gray group-hover:text-primary-moss transition-colors">
                <span className="font-medium">
                  View recipe detail
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Global Chatbot FAB & Interactive Popup Widget */}
      <aside className="fixed bottom-6 right-6 z-50">
        {/* Chat FAB Button (56px circle, primary-moss, white AI sparkle) */}
        <button className="w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shadow-subtle transition-all focus:outline-none focus:ring-2 focus:ring-primary-moss/40 cursor-pointer" id="chat-fab" title="AI Nutrition Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
        {/* Chat Popup Panel */}
        <div className="w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-subtle flex flex-col overflow-hidden hidden" id="chat-popup">
          {/* Header */}
          <div className="p-3.5 bg-surface-paper border-b border-border-sage-mist flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss flex-shrink-0">
                <svg className="w-5 h-5 text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-text-charcoal leading-tight">
                  AI Nutrition Assistant
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-success-sprout inline-block"></span>
                  <span className="text-[11px] text-text-stem-gray">
                    Online & ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-text-stem-gray">
              <button className="w-7 h-7 rounded-lg hover:bg-herb-white flex items-center justify-center transition-colors" id="chat-minimize" title="Minimize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-7 h-7 rounded-lg hover:bg-herb-white flex items-center justify-center transition-colors" id="chat-close" title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat History / Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[13px] bg-herb-white/50">
            {/* AI Greeting */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-primary-moss/10 flex items-center justify-center text-primary-moss flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-surface-paper border border-border-sage-mist text-text-charcoal shadow-sm leading-relaxed">
                Hello! I am the Vegan Helper AI Nutrition Assistant. I can assist you with wholesome plant-based recipes, balanced nutrition insights, or personalized menu suggestions for today.
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-primary-moss text-white leading-relaxed">
                Could you recommend a light, high-protein plant-based lunch for today?
              </div>
            </div>
            {/* AI Reply */}
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-primary-moss/10 flex items-center justify-center text-primary-moss flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-surface-paper border border-border-sage-mist text-text-charcoal shadow-sm leading-relaxed">
                For lunch today, consider pairing
                <strong>
                  Lotus Seed & Seaweed Soup
                </strong>
                with
                <strong>
                  Silken Tofu in Shiitake Sauce
                </strong>
                . This combination delivers clean plant protein, promotes gentle digestion, and replenishes energy!
              </div>
            </div>
          </div>
          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-surface-paper border-t border-border-sage-mist overflow-x-auto flex-shrink-0 flex items-center gap-1.5 min-w-max">
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-herb-white hover:bg-border-sage-mist/50 border border-border-sage-mist text-text-charcoal transition-colors whitespace-nowrap focus:outline-none">
              🌱 High Protein Dishes
            </button>
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-herb-white hover:bg-border-sage-mist/50 border border-border-sage-mist text-text-charcoal transition-colors whitespace-nowrap focus:outline-none">
              🥣 Weight Loss Menu
            </button>
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-herb-white hover:bg-border-sage-mist/50 border border-border-sage-mist text-text-charcoal transition-colors whitespace-nowrap focus:outline-none">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* Message Input */}
          <div className="p-3 bg-surface-paper border-t border-border-sage-mist flex-shrink-0">
            <form className="flex items-center gap-2">
              <input className="flex-1 h-10 px-3.5 rounded-lg bg-herb-white border border-border-sage-mist text-[13px] text-text-charcoal focus:outline-none focus:border-primary-moss" placeholder="Ask AI nutrition assistant..." type="text" />
              <button className="w-10 h-10 rounded-lg bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center flex-shrink-0 transition-colors focus:outline-none" title="Send message" type="submit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" x2="11" y1="2" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>
      {/* Footer */}
      <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fraunces font-semibold text-[#2F5233] text-base">
              Vegan Helper
            </span>
            <span className="">
              •
            </span>
            <span className="">
              Plant-based culinary & family nutrition platform
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              About Us
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default WeeklyMenu;
