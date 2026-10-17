import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import imgBraised from '../../assets/images/categories/category-braised-dishes.jpg';
import imgSoups from '../../assets/images/categories/category-soups.jpg';
import imgStirFried from '../../assets/images/categories/category-stir-fried.jpg';
import imgHotPots from '../../assets/images/categories/category-hot-pots.jpg';
import imgPho from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';
import imgSpringRolls from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';

export default function AdminContentManagement() {
  // Comprehensive content moderation dataset with initial real-world items
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Traditional Claypot Braised Tofu with Lemongrass & Black Pepper',
      type: 'Recipe',
      author: 'Mai Linh',
      authorUsername: 'mailinh_chef',
      authorRole: 'Chef',
      category: 'Main Courses',
      status: 'Pending',
      submittedAt: '17 Oct, 2026 • 14:20',
      excerpt: 'A deeply savory, caramelized tofu dish infused with fresh lemongrass, garlic, and cracked black pepper.',
      prepTime: '15 mins',
      cookTime: '25 mins',
      servings: '4 servings',
      ingredients: [
        '500g Non-GMO firm tofu (cubed and lightly pan-seared)',
        '3 stalks fresh lemongrass, finely minced',
        '2 tbsp premium vegetarian mushroom sauce',
        '1 tbsp coconut caramel sauce (nước màu dừa)',
        '1 tsp freshly cracked black pepper',
        'Fresh red chili & scallions for garnish',
      ],
      steps: [
        'Cut tofu into bite-sized cubes and lightly brown all sides in a skillet.',
        'Sauté minced lemongrass, garlic, and chili until fragrant and golden.',
        'In a claypot, simmer mushroom sauce, coconut caramel, and filtered water until bubbling.',
        'Add pan-seared tofu, reduce heat to low, and simmer for 20 minutes until deeply glazed.',
        'Top with cracked black pepper and fresh herbs before serving hot with steamed jasmine rice.',
      ],
      image: imgBraised,
    },
    {
      id: 2,
      title: 'Mastering Vegan Phở Broth: Charred Ginger & Botanical Spices',
      type: 'Video',
      duration: '12:34',
      author: 'Chef Duy',
      authorUsername: 'chefduy_culinary',
      authorRole: 'Chef',
      category: 'Soups & Broths',
      status: 'Flagged',
      submittedAt: '16 Oct, 2026 • 09:15',
      excerpt: 'Step-by-step masterclass on slow-charring ginger and star anise for golden vegan phở broth.',
      flagReason: 'Commercial Sponsor Links',
      flagDetail: 'AI Scanner detected external Telegram link and unverified sponsored supplements in the recipe video description.',
      confidence: '94% Confidence',
      prepTime: '20 mins',
      cookTime: '2 hours',
      servings: '6 bowls',
      ingredients: [
        '2 charred yellow onions and 1 large piece charred ginger',
        '4 star anise, 1 black cardamom, 1 cinnamon bark',
        '1 daikon radish, 1 jicama, 2 carrots, 1 corn cob for natural sweetness',
        'Dried shiitake mushrooms and roasted coriander seeds',
      ],
      steps: [
        'Char onions and ginger over open flame until fragrant and slightly blackened.',
        'Toast whole spices in a dry pan until aromatic.',
        'Simmer root vegetables and toasted spices for 2 hours on low heat.',
        'Strain clear golden broth, season with rock sugar and sea salt.',
      ],
      image: imgPho,
    },
    {
      id: 3,
      title: 'Crispy Vietnamese Spring Rolls with Sweet & Tangy Dip',
      type: 'Recipe',
      author: 'Phạm Văn Minh',
      authorUsername: 'minh_pv',
      authorRole: 'Member',
      category: 'Main Courses',
      status: 'Flagged',
      submittedAt: '15 Oct, 2026 • 18:40',
      excerpt: 'Crispy rice paper rolls stuffed with wood ear mushrooms, glass noodles, and shredded taro root.',
      flagReason: 'Suspected Non-Vegan Ingredient',
      flagDetail: '3 community members reported that ingredient list mentions commercial fish sauce instead of vegan fermented pineapple sauce.',
      confidence: 'Community Reports (3)',
      prepTime: '30 mins',
      cookTime: '20 mins',
      servings: '5 servings',
      ingredients: [
        'Rice paper wrappers',
        '200g taro root, julienned',
        '50g wood ear mushrooms, soaked and shredded',
        '100g bean thread glass noodles',
        'Sweet & sour dipping sauce',
      ],
      steps: [
        'Soak glass noodles and wood ear mushrooms in warm water, drain thoroughly.',
        'Mix taro, mushrooms, noodles, and seasonings evenly.',
        'Roll tightly in rice paper sheets and fry in hot vegetable oil until crisp and golden.',
      ],
      image: imgSpringRolls,
    },
    {
      id: 4,
      title: 'Comment on "Healing Lotus Seed & Wild Mushroom Stew"',
      type: 'Comment',
      author: 'user_99218',
      authorUsername: 'user992',
      authorRole: 'Member',
      category: 'Discussion',
      status: 'Flagged',
      submittedAt: '15 Oct, 2026 • 23:48',
      excerpt: '“Check my telegram link t.me/crypto_profit for guaranteed 200% returns and herbal supplies!”',
      flagReason: 'Automated Spam Link Filter',
      flagDetail: 'Comment contains known commercial crypto phishing pattern.',
      confidence: '99% Confidence',
      ingredients: [],
      steps: [],
      image: null,
    },
    {
      id: 5,
      title: 'Wild Forest Mushroom & Lotus Root Herbal Hot Pot',
      type: 'Recipe',
      author: 'Hoàng Thu Thảo',
      authorUsername: 'thuthaoveg',
      authorRole: 'Member',
      category: 'Plant-based Hot Pots',
      status: 'Published',
      submittedAt: '14 Oct, 2026 • 11:05',
      excerpt: 'A communal, deeply nourishing hot pot showcasing four varieties of forest mushrooms in herbal dashi.',
      prepTime: '25 mins',
      cookTime: '40 mins',
      servings: '6 servings',
      ingredients: [
        '300g fresh King Oyster mushrooms',
        '200g Shimeji & Enoki mushrooms',
        '1 fresh lotus root, sliced',
        'Chinese red dates, goji berries, and sweet corn',
        'Tofu skin rolls (tàu hũ ky) & fresh chrysanthemum greens',
      ],
      steps: [
        'Prepare the herbal broth with lotus root, corn, red dates, and goji berries.',
        'Arrange mushrooms, tofu skin, and greens on a large serving platter.',
        'Bring broth to a gentle rolling boil at the dining table and dip fresh botanicals.',
      ],
      image: imgHotPots,
    },
    {
      id: 6,
      title: 'Pan-Seared King Oyster Mushrooms with Sweet Glaze',
      type: 'Recipe',
      author: 'Lê Ngọc Mai',
      authorUsername: 'ngocmai_green',
      authorRole: 'Member',
      category: 'Main Courses',
      status: 'Rejected',
      submittedAt: '13 Oct, 2026 • 08:30',
      excerpt: 'Thick score-cut King Oyster mushrooms pan-seared with sweet honey glaze and sesame oil.',
      rejectionReason: 'Recipe contains non-vegan ingredient (bee honey). Please substitute with pure organic maple syrup or sugarcane molasses to comply with 100% vegan guidelines.',
      prepTime: '10 mins',
      cookTime: '15 mins',
      servings: '2 servings',
      ingredients: [
        '3 large King Oyster mushroom stalks',
        '1 tbsp soy sauce, 1 tsp sesame oil',
        '1 tbsp sweetener glaze',
      ],
      steps: [
        'Score mushrooms in a diamond crosshatch pattern.',
        'Sear in hot pan until golden, baste with glaze until glossy.',
      ],
      image: imgStirFried,
    },
  ]);

  // Filter & Search states
  const [tabFilter, setTabFilter] = useState('All'); // All | Pending | Flagged | Published | Rejected
  const [typeFilter, setTypeFilter] = useState('All'); // All | Recipe | Video | Comment
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority'); // priority | newest | oldest
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    item: null,
  });

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    item: null,
    reasonCategory: 'Non-Vegan Ingredient',
    customReason: '',
    sendEmailNotification: true,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
  });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => i.status === 'Pending').length;
    const flagged = items.filter((i) => i.status === 'Flagged').length;
    const published = items.filter((i) => i.status === 'Published').length;
    const rejected = items.filter((i) => i.status === 'Rejected').length;
    return { total, pending, flagged, published, rejected };
  }, [items]);

  // Filtering & Sorting
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Tab filter
        if (tabFilter === 'Pending' && item.status !== 'Pending') return false;
        if (tabFilter === 'Flagged' && item.status !== 'Flagged') return false;
        if (tabFilter === 'Published' && item.status !== 'Published') return false;
        if (tabFilter === 'Rejected' && item.status !== 'Rejected') return false;

        // Content Type filter
        if (typeFilter !== 'All' && item.type !== typeFilter) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchAuthor = item.author.toLowerCase().includes(q) || item.authorUsername.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          // Priority: Flagged first, then Pending, then Published
          const order = { Flagged: 1, Pending: 2, Published: 3, Rejected: 4 };
          return (order[a.status] || 5) - (order[b.status] || 5);
        }
        if (sortBy === 'newest') return b.id - a.id;
        if (sortBy === 'oldest') return a.id - b.id;
        return 0;
      });
  }, [items, tabFilter, typeFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handlers for Approving Content (FN41)
  const handleApprove = (item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'Published',
              flagReason: undefined,
              flagDetail: undefined,
              rejectionReason: undefined,
            }
          : i
      )
    );
    showToast(`"${item.title}" has been approved and published to the live platform.`, 'success');
    if (previewModal.isOpen && previewModal.item?.id === item.id) {
      setPreviewModal({ isOpen: false, item: null });
    }
  };

  // Handlers for Dismissing Flag (Restore Flagged Item to Published)
  const handleDismissFlag = (item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'Published',
              flagReason: undefined,
              flagDetail: undefined,
            }
          : i
      )
    );
    showToast(`Flag on "${item.title}" dismissed. Content restored to good standing.`, 'success');
  };

  // Handlers for Rejecting Content (FN41: Mandatory Reason)
  const handleOpenRejectModal = (item) => {
    setRejectModal({
      isOpen: true,
      item,
      reasonCategory: 'Non-Vegan Ingredient',
      customReason: '',
      sendEmailNotification: true,
    });
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModal.item) return;

    const fullReason =
      rejectModal.customReason.trim() ||
      `Violation: ${rejectModal.reasonCategory}. Content does not meet platform community standards.`;

    setItems((prev) =>
      prev.map((i) =>
        i.id === rejectModal.item.id
          ? {
              ...i,
              status: 'Rejected',
              rejectionReason: fullReason,
            }
          : i
      )
    );

    showToast(
      `Content "${rejectModal.item.title}" rejected. Author @${rejectModal.item.authorUsername} notified.`,
      'success'
    );

    setRejectModal({
      isOpen: false,
      item: null,
      reasonCategory: 'Non-Vegan Ingredient',
      customReason: '',
      sendEmailNotification: true,
    });

    if (previewModal.isOpen && previewModal.item?.id === rejectModal.item.id) {
      setPreviewModal({ isOpen: false, item: null });
    }
  };

  // Handlers for Deleting Content
  const handleOpenDeleteModal = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleConfirmDelete = () => {
    if (!deleteModal.item) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteModal.item.id));
    showToast(`Content "${deleteModal.item.title}" permanently removed.`, 'success');
    setDeleteModal({ isOpen: false, item: null });
    if (previewModal.isOpen && previewModal.item?.id === deleteModal.item.id) {
      setPreviewModal({ isOpen: false, item: null });
    }
  };

  const handleClearFilters = () => {
    setTabFilter('All');
    setTypeFilter('All');
    setSearchQuery('');
    setSortBy('priority');
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Feedback */}
        {toast.show && (
          <div
            role="status"
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-[#FDF2F2] text-[#A63446] border-[#F4C2BC]'
                : 'bg-[#2F5233] text-white border-[#25401F]'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toast.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              )}
            </svg>
            <span>{toast.message}</span>
          </div>
        )}

        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25] tracking-tight">
              Content Moderation
            </h1>
            <p className="text-sm text-[#6B6F63] mt-1">
              Review recipe submissions, inspect AI-flagged content, and maintain culinary vegan standards.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full shadow-xs hover:border-[#2F5233] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* 2. KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Pending Review</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2F5233]">{stats.pending}</span>
              <span className="text-[11px] text-[#4C8C4A] font-medium">Awaiting decision</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Flagged & Reported</span>
              <div className="w-7 h-7 rounded-lg bg-[#FBEAE7] flex items-center justify-center text-[#A63446]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#A63446]">{stats.flagged}</span>
              <span className="text-[11px] text-[#A63446] font-semibold">Priority check</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Approved & Live</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25]">{stats.published}</span>
              <span className="text-[11px] text-[#6B6F63]">Active on site</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Rejected / Removed</span>
              <div className="w-7 h-7 rounded-lg bg-[#FAFBF9] flex items-center justify-center text-[#6B6F63]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#6B6F63]">{stats.rejected}</span>
              <span className="text-[11px] text-[#8A9080]">Filtered out</span>
            </div>
          </div>
        </div>

        {/* 3. Toolbar & Queue Switcher Tabs */}
        <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by title, author name, or keyword..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl focus:bg-white focus:border-[#2F5233] focus:ring-1 focus:ring-[#2F5233] outline-none transition-all placeholder-[#8A9080] text-[#2B2A25]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Segmented Queue Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center bg-[#F4F6F1] p-1 rounded-xl border border-[#DCE3D5]">
                {[
                  { id: 'All', label: 'All Items' },
                  { id: 'Pending', label: `Pending (${stats.pending})` },
                  { id: 'Flagged', label: `Flagged (${stats.flagged})` },
                  { id: 'Published', label: 'Published' },
                  { id: 'Rejected', label: 'Rejected' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setTabFilter(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                      tabFilter === tab.id
                        ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                        : 'text-[#6B6F63] hover:text-[#2B2A25]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Recipe">Recipes</option>
                  <option value="Video">Videos</option>
                  <option value="Comment">Comments</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="priority">Sort: Action Priority</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active search filter counter notice */}
          <div className="flex items-center justify-between text-xs text-[#6B6F63] pt-2 border-t border-[#EAF0E9]">
            <div>
              Showing <span className="font-bold text-[#2B2A25]">{filteredItems.length}</span> of{' '}
              <span className="font-bold text-[#2B2A25]">{items.length}</span> items
            </div>
            {(searchQuery || tabFilter !== 'All' || typeFilter !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#2F5233] font-semibold underline hover:text-[#25401F]"
              >
                Clear all active filters
              </button>
            )}
          </div>
        </div>

        {/* 4. Moderation Items List */}
        <div className="space-y-4">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => {
              const isFlagged = item.status === 'Flagged';
              const isPending = item.status === 'Pending';
              const isPublished = item.status === 'Published';
              const isRejected = item.status === 'Rejected';

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-[24px] p-5 sm:p-6 shadow-xs transition-all ${
                    isFlagged
                      ? 'border-[#F4C2BC] bg-[#FFFAF9]'
                      : isPending
                      ? 'border-[#DCE3D5]'
                      : 'border-[#DCE3D5]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-5">
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Thumbnail Container */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#DCE3D5] bg-[#F4F6F1] flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#6B6F63]">
                            <svg className="w-8 h-8 text-[#A8BDA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span className="text-[10px] mt-1 font-medium">Comment</span>
                          </div>
                        )}

                        {/* Video Duration Pill */}
                        {item.duration && (
                          <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            {item.duration}
                          </span>
                        )}
                      </div>

                      {/* Content Information */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Status & Type Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              item.type === 'Video'
                                ? 'bg-[#FFF8E6] text-[#8A6114] border-[#FCE3B4]'
                                : item.type === 'Comment'
                                ? 'bg-[#F4F6F1] text-[#555A4E] border-[#DCE3D5]'
                                : 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                            }`}
                          >
                            {item.type}
                          </span>

                          <span className="text-[11px] text-[#8A9080] font-medium">
                            {item.category}
                          </span>

                          {/* Status Pill */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isFlagged
                                ? 'bg-[#FBEAE7] text-[#A63446] border-[#F4C2BC]'
                                : isPending
                                ? 'bg-[#FFF8E6] text-[#8A6114] border-[#FCE3B4]'
                                : isPublished
                                ? 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                                : 'bg-[#F4F6F1] text-[#6B6F63] border-[#DCE3D5]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isFlagged
                                  ? 'bg-[#A63446]'
                                  : isPending
                                  ? 'bg-[#8A6114]'
                                  : isPublished
                                  ? 'bg-[#4C8C4A]'
                                  : 'bg-[#9CA3AF]'
                              }`}
                            />
                            {item.status === 'Pending'
                              ? 'Pending Approval'
                              : item.status === 'Flagged'
                              ? 'Flagged for Review'
                              : item.status}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => setPreviewModal({ isOpen: true, item })}
                          className="font-bold text-sm sm:text-base text-[#2B2A25] hover:text-[#2F5233] cursor-pointer transition-colors leading-snug line-clamp-2"
                        >
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-[#6B6F63] line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>

                        {/* Flag Warning Box (if flagged) */}
                        {isFlagged && (
                          <div className="mt-2 p-3 rounded-xl bg-[#FBEAE7] border border-[#F4C2BC] text-xs text-[#A63446] space-y-1">
                            <div className="flex items-center justify-between font-bold text-[11px]">
                              <span>Reason: {item.flagReason}</span>
                              <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px]">
                                {item.confidence}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8A2B3A]">{item.flagDetail}</p>
                          </div>
                        )}

                        {/* Rejection Notice (if rejected) */}
                        {isRejected && item.rejectionReason && (
                          <div className="mt-2 p-2.5 rounded-xl bg-[#F4F6F1] border border-[#DCE3D5] text-[11px] text-[#6B6F63]">
                            <strong className="text-[#A63446] block mb-0.5">Rejection Feedback Sent to Author:</strong>
                            <p>{item.rejectionReason}</p>
                          </div>
                        )}

                        {/* Author & Timestamp Footer */}
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-[#6B6F63]">
                          <span>
                            Author:{' '}
                            <strong className="font-semibold text-[#2B2A25]">
                              {item.author}
                            </strong>{' '}
                            <span className="text-[#8A9080]">(@{item.authorUsername})</span>
                          </span>
                          <span>•</span>
                          <span>Submitted: {item.submittedAt}</span>
                          {item.prepTime && (
                            <>
                              <span>•</span>
                              <span>{item.prepTime} prep • {item.cookTime} cook</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Moderation Action Buttons */}
                    <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EAF0E9]">
                      {/* Inspect Preview Button */}
                      <button
                        onClick={() => setPreviewModal({ isOpen: true, item })}
                        className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:border-[#2F5233] hover:text-[#2F5233] transition-all"
                      >
                        Inspect Details
                      </button>

                      {/* Approve Button (For Pending or Flagged) */}
                      {(isPending || isFlagged) && (
                        <button
                          onClick={() => handleApprove(item)}
                          className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-[#2F5233] rounded-xl shadow-xs hover:bg-[#25401F] active:scale-95 transition-all"
                        >
                          Approve Post
                        </button>
                      )}

                      {/* Dismiss Flag Button (For Flagged items) */}
                      {isFlagged && (
                        <button
                          onClick={() => handleDismissFlag(item)}
                          className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-xl hover:bg-[#2F5233] hover:text-white transition-all"
                          title="Dismiss report and restore content"
                        >
                          Dismiss Flag
                        </button>
                      )}

                      {/* Reject Button (For Pending or Published) */}
                      {!isRejected && (
                        <button
                          onClick={() => handleOpenRejectModal(item)}
                          className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-[#A63446] bg-[#FBEAE7] border border-[#F4C2BC] rounded-xl hover:bg-[#A63446] hover:text-white transition-all"
                        >
                          Reject
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleOpenDeleteModal(item)}
                        className="px-2.5 py-2 text-xs text-[#8A9080] hover:text-[#A63446] transition-colors"
                        title="Remove Content"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-[#DCE3D5] rounded-[24px] p-12 text-center text-[#6B6F63]">
              <svg className="w-12 h-12 text-[#A8BDA2] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold text-base text-[#2B2A25]">Queue is Clear</h3>
              <p className="text-xs text-[#8A9080] mt-1">
                No items match your selected filter or search keyword.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-full hover:bg-[#2F5233] hover:text-white transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* 5. Pagination */}
        {filteredItems.length > 0 && (
          <div className="bg-white border border-[#DCE3D5] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6F63]">
            <div>
              Showing{' '}
              <span className="font-semibold text-[#2B2A25]">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-[#2B2A25]">
                {Math.min(currentPage * pageSize, filteredItems.length)}
              </span>{' '}
              of <span className="font-semibold text-[#2B2A25]">{filteredItems.length}</span> items
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-white text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#2F5233] text-white shadow-xs'
                        : 'border border-[#DCE3D5] bg-white text-[#6B6F63] hover:border-[#2F5233] hover:text-[#2B2A25]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-white text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 1: REJECT CONTENT WITH MANDATORY REASON (FN41)         */}
        {/* ============================================================ */}
        {rejectModal.isOpen && rejectModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-lg w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FBEAE7] text-[#A63446] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">Reject Submission</h3>
                    <p className="text-xs text-[#6B6F63]">Provide specific feedback for the author</p>
                  </div>
                </div>
                <button
                  onClick={() => setRejectModal({ isOpen: false, item: null, reasonCategory: 'Non-Vegan Ingredient', customReason: '', sendEmailNotification: true })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleConfirmReject} className="mt-4 space-y-4 text-xs">
                {/* Target Content Summary */}
                <div className="bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl p-3">
                  <p className="font-semibold text-xs text-[#2B2A25]">{rejectModal.item.title}</p>
                  <p className="text-[11px] text-[#6B6F63] mt-0.5">
                    Author: {rejectModal.item.author} (@{rejectModal.item.authorUsername}) • {rejectModal.item.category}
                  </p>
                </div>

                {/* Pre-set Violation Category */}
                <div>
                  <label className="block font-semibold text-[#2B2A25] mb-1.5">
                    Primary Reason Category <span className="text-[#A63446]">*</span>
                  </label>
                  <select
                    value={rejectModal.reasonCategory}
                    onChange={(e) => setRejectModal((prev) => ({ ...prev, reasonCategory: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25]"
                  >
                    <option value="Non-Vegan Ingredient">Contains Non-Vegan Ingredient (Meat, Dairy, Honey, Gelatin)</option>
                    <option value="Commercial Advertising & Spam">Commercial Advertising, Affiliate Links, or Spam</option>
                    <option value="Copyright & Plagiarism">Copyright Infringement / Plagiarized Material</option>
                    <option value="Inappropriate Content">Inappropriate, Offensive, or Abusive Language</option>
                    <option value="Misleading Dietary Information">Misleading or Dangerous Health Claims</option>
                    <option value="Other">Other Specific Guidelines Violation</option>
                  </select>
                </div>

                {/* Detailed Explanation */}
                <div>
                  <label className="block font-semibold text-[#2B2A25] mb-1.5">
                    Specific Editorial Explanation <span className="text-[#A63446]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain clearly to the author what needs to be changed (e.g. Please replace dairy butter with coconut butter or plant margarine)..."
                    value={rejectModal.customReason}
                    onChange={(e) => setRejectModal((prev) => ({ ...prev, customReason: e.target.value }))}
                    className="w-full p-3 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25] placeholder-[#8A9080]"
                  />
                </div>

                {/* Notify author checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifyAuthorCheckbox"
                    checked={rejectModal.sendEmailNotification}
                    onChange={(e) => setRejectModal((prev) => ({ ...prev, sendEmailNotification: e.target.checked }))}
                    className="rounded text-[#2F5233] focus:ring-[#2F5233] border-[#DCE3D5]"
                  />
                  <label htmlFor="notifyAuthorCheckbox" className="text-xs text-[#2B2A25] cursor-pointer">
                    Send automated notification & guidelines email to author
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#DCE3D5]">
                  <button
                    type="button"
                    onClick={() => setRejectModal({ isOpen: false, item: null, reasonCategory: 'Non-Vegan Ingredient', customReason: '', sendEmailNotification: true })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#A63446] rounded-xl shadow-xs hover:bg-[#8B2B3A] transition-colors"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: FULL CONTENT INSPECT & PREVIEW                      */}
        {/* ============================================================ */}
        {previewModal.isOpen && previewModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-2xl w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                      {previewModal.item.type}
                    </span>
                    <span className="text-xs text-[#6B6F63]">{previewModal.item.category}</span>
                  </div>
                  <h2 className="font-bold text-lg text-[#2B2A25]">{previewModal.item.title}</h2>
                </div>
                <button
                  onClick={() => setPreviewModal({ isOpen: false, item: null })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="mt-4 space-y-4 text-xs">
                {/* Image if present */}
                {previewModal.item.image && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-[#DCE3D5]">
                    <img
                      src={previewModal.item.image}
                      alt={previewModal.item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Author Info Card */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#DCE3D5] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-[#2B2A25]">
                      {previewModal.item.author}{' '}
                      <span className="text-[#8A9080] font-normal">(@{previewModal.item.authorUsername})</span>
                    </p>
                    <p className="text-[11px] text-[#6B6F63] mt-0.5">Role: {previewModal.item.authorRole} • Submitted: {previewModal.item.submittedAt}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                    {previewModal.item.status}
                  </span>
                </div>

                {/* Ingredients (if recipe) */}
                {previewModal.item.ingredients && previewModal.item.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs text-[#2B2A25] mb-2">Ingredients List</h4>
                    <ul className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-[#DCE3D5]">
                      {previewModal.item.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[#2B2A25]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233]" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Steps (if recipe) */}
                {previewModal.item.steps && previewModal.item.steps.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs text-[#2B2A25] mb-2">Preparation Steps</h4>
                    <ol className="space-y-2 bg-white p-3.5 rounded-2xl border border-[#DCE3D5]">
                      {previewModal.item.steps.map((st, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[#2B2A25]">
                          <span className="font-bold text-[#2F5233] shrink-0">{idx + 1}.</span>
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Flag Notice if Flagged */}
                {previewModal.item.status === 'Flagged' && (
                  <div className="bg-[#FBEAE7] border border-[#F4C2BC] rounded-2xl p-4 text-[#A63446]">
                    <span className="font-bold block mb-1">Violation Flag Details:</span>
                    <p className="text-[11px] leading-relaxed">
                      Reason: {previewModal.item.flagReason}
                      <br />
                      Details: {previewModal.item.flagDetail}
                    </p>
                  </div>
                )}

                {/* Modal Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-[#DCE3D5]">
                  <button
                    onClick={() => setPreviewModal({ isOpen: false, item: null })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9]"
                  >
                    Close
                  </button>

                  <div className="flex items-center gap-2">
                    {previewModal.item.status !== 'Rejected' && (
                      <button
                        onClick={() => handleOpenRejectModal(previewModal.item)}
                        className="px-4 py-2 text-xs font-semibold text-[#A63446] bg-[#FBEAE7] border border-[#F4C2BC] rounded-xl hover:bg-[#A63446] hover:text-white transition-all"
                      >
                        Reject Submission
                      </button>
                    )}

                    {previewModal.item.status !== 'Published' && (
                      <button
                        onClick={() => handleApprove(previewModal.item)}
                        className="px-5 py-2 text-xs font-semibold text-white bg-[#2F5233] rounded-xl shadow-xs hover:bg-[#25401F] transition-all"
                      >
                        Approve & Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 3: DELETE CONFIRMATION MODAL                           */}
        {/* ============================================================ */}
        {deleteModal.isOpen && deleteModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-md w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FBEAE7] text-[#A63446] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">Delete Content</h3>
                    <p className="text-xs text-[#6B6F63]">Permanently remove post or comment</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteModal({ isOpen: false, item: null })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <p className="text-[#2B2A25]">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-[#2F5233]">"{deleteModal.item.title}"</strong>?
                </p>
                <div className="bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl p-3 text-[#6B6F63]">
                  <p>Author: <strong className="text-[#2B2A25]">{deleteModal.item.author}</strong></p>
                  <p className="mt-1">Type: {deleteModal.item.type} • Status: {deleteModal.item.status}</p>
                </div>
                <p className="text-[11px] text-[#8A9080]">
                  This action is irreversible. The content will be wiped from all search indexes and feeds.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: false, item: null })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#A63446] rounded-xl shadow-xs hover:bg-[#8B2B3A] transition-colors"
                  >
                    Delete Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
