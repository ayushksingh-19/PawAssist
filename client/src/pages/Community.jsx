import { useMemo, useState } from "react";
import useAppData from "../services/useAppData";

const communityStats = [
  { id: "stat-1", value: "52.3K", label: "Members" },
  { id: "stat-2", value: "28.9K", label: "Posts" },
  { id: "stat-3", value: "3.2K", label: "Active Today" },
  { id: "stat-4", value: "156", label: "Events" },
];

const communityTabs = ["Feed", "Groups", "Events", "Q&A"];

const topicList = [
  { id: "topic-1", title: "Training Tips", count: "12.3K discussions", tone: "teal" },
  { id: "topic-2", title: "Health & Nutrition", count: "25.4K discussions", tone: "green" },
  { id: "topic-3", title: "Adoption Stories", count: "8.8K discussions", tone: "rose" },
  { id: "topic-4", title: "Lost & Found", count: "2.0K discussions", tone: "clay" },
  { id: "topic-5", title: "Grooming Tips", count: "15.8K discussions", tone: "lavender" },
  { id: "topic-6", title: "Playtime & Fun", count: "18.9K discussions", tone: "sky" },
];

const trendingTags = [
  { id: "trend-1", tag: "#PetCare", uses: 3062 },
  { id: "trend-2", tag: "#DogTraining", uses: 5580 },
  { id: "trend-3", tag: "#AdoptDontShop", uses: 5411 },
  { id: "trend-4", tag: "#HealthyPets", uses: 4004 },
  { id: "trend-5", tag: "#PetNutrition", uses: 1269 },
];

const starterPosts = [
  {
    id: "post-1",
    author: "Sarah Johnson",
    role: "Premium",
    time: "2 hours ago",
    location: "Mumbai, India",
    followers: "2.3K followers",
    copy:
      "Just adopted this beautiful golden retriever! Any tips for first-time golden parents? Looking for advice on training, diet, and exercise routines. He's 8 weeks old and absolutely adorable!",
    tags: ["#Adoption", "#GoldenRetriever", "#Tips"],
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80",
    likes: 1234,
    comments: 145,
    shares: 45,
    saved: false,
    liked: false,
    shared: false,
    topic: "Adoption Stories",
  },
  {
    id: "post-2",
    author: "Dr. Priya Sharma",
    role: "Verified Vet",
    time: "5 hours ago",
    location: "Bangalore, India",
    followers: "15.2K followers",
    copy:
      "Dental care tip: Regular dental hygiene is crucial for your pet's health. Brush your dog's teeth 3x a week to prevent periodontal disease. Use pet-specific toothpaste only.",
    tags: ["#HealthTip", "#DentalCare", "#Prevention"],
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=220&q=80",
    likes: 3567,
    comments: 289,
    shares: 156,
    saved: false,
    liked: false,
    shared: false,
    topic: "Health & Nutrition",
  },
  {
    id: "post-3",
    author: "Mike Chen",
    role: "",
    time: "1 day ago",
    location: "Delhi, India",
    followers: "890 followers",
    copy:
      "Luna's third birthday celebration today! Can't believe how fast time flies. She's been the best companion through everything. Thank you all for the birthday wishes!",
    tags: ["#Birthday", "#Celebration", "#PersianCat"],
    image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80",
    likes: 2892,
    comments: 423,
    shares: 78,
    saved: false,
    liked: false,
    shared: false,
    topic: "Playtime & Fun",
  },
  {
    id: "post-4",
    author: "Riya Kapoor",
    role: "Expert Groomer",
    time: "2 days ago",
    location: "Pune, India",
    followers: "8.5K followers",
    copy:
      "Grooming tip: Summer is here! Keep your furry friend's cool with regular grooming. Double-coated breeds need special attention. Never shave them completely; their coat protects them from heat too.",
    tags: ["#Grooming", "#SummerCare", "#Professional"],
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=220&q=80",
    likes: 1678,
    comments: 156,
    shares: 89,
    saved: false,
    liked: false,
    shared: false,
    topic: "Grooming Tips",
  },
];

const filterInitialState = {
  sortBy: "Most Recent",
  category: "All Categories",
  location: "All Locations",
  timeRange: "All Time",
};

export default function Community() {
  const { data, loading } = useAppData();
  const [activeTab, setActiveTab] = useState("Feed");
  const [composerText, setComposerText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(starterPosts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [createDraft, setCreateDraft] = useState("");
  const [createTags, setCreateTags] = useState("");
  const [filterState, setFilterState] = useState(filterInitialState);
  const [note, setNote] = useState("");

  const selectedPost = posts.find((post) => post.id === selectedPostId);
  const appPosts = data?.communityPosts || [];

  const visiblePosts = useMemo(() => {
    let list = [...posts];
    const term = searchQuery.trim().toLowerCase();

    if (term) {
      list = list.filter((post) =>
        [post.author, post.copy, post.topic, ...(post.tags || [])].join(" ").toLowerCase().includes(term),
      );
    }

    if (filterState.category !== "All Categories") {
      list = list.filter((post) => post.topic === filterState.category);
    }

    if (filterState.location !== "All Locations") {
      list = list.filter((post) => post.location.includes(filterState.location));
    }

    if (filterState.sortBy === "Most Liked") {
      list.sort((a, b) => b.likes - a.likes);
    } else if (filterState.sortBy === "Most Commented") {
      list.sort((a, b) => b.comments - a.comments);
    }

    return list;
  }, [filterState, posts, searchQuery]);

  if (loading || !data) {
    return <div className="panel">Loading community...</div>;
  }

  const updatePost = (postId, updater) => {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? updater(post) : post)),
    );
  };

  const handleLike = (postId) => {
    updatePost(postId, (post) => ({
      ...post,
      liked: !post.liked,
      likes: post.likes + (post.liked ? -1 : 1),
    }));
    setNote("Like updated.");
  };

  const handleShare = (postId) => {
    updatePost(postId, (post) => ({
      ...post,
      shared: true,
      shares: post.shared ? post.shares : post.shares + 1,
    }));
    setNote("Post shared.");
  };

  const handleSave = (postId) => {
    updatePost(postId, (post) => ({
      ...post,
      saved: !post.saved,
    }));
    setNote("Saved posts updated.");
  };

  const handleOpenComment = (postId) => {
    setSelectedPostId(postId);
    setCommentDraft("");
    setShowCommentModal(true);
  };

  const handlePostComment = () => {
    if (!selectedPostId || !commentDraft.trim()) {
      return;
    }

    updatePost(selectedPostId, (post) => ({
      ...post,
      comments: post.comments + 1,
    }));
    setShowCommentModal(false);
    setCommentDraft("");
    setNote("Comment posted.");
  };

  const handlePublishPost = () => {
    if (!createDraft.trim()) {
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: "Pet Parent",
      role: "",
      time: "Just now",
      location: "Kolkata, India",
      followers: "New member",
      copy: createDraft.trim(),
      tags: createTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
      image: "",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=220&q=80",
      likes: 0,
      comments: 0,
      shares: 0,
      saved: false,
      liked: false,
      shared: false,
      topic: filterState.category === "All Categories" ? "PetCare" : filterState.category,
    };

    setPosts((current) => [newPost, ...current]);
    setShowCreateModal(false);
    setCreateDraft("");
    setCreateTags("");
    setNote("Post published.");
  };

  const handleComposerPost = () => {
    if (!composerText.trim()) {
      return;
    }

    setCreateDraft(composerText);
    setComposerText("");
    setShowCreateModal(true);
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    setNote("Filters applied.");
  };

  return (
    <div className="care-page community-hub-page">
      <header className="community-hero-panel">
        <div className="community-hero-head">
          <div>
            <h1>Pet Parents Community</h1>
            <p>Connect with 50K+ pet parents across India</p>
          </div>
          <button type="button" className="community-create-button" onClick={() => setShowCreateModal(true)}>
            + Create Post
          </button>
        </div>

        <div className="community-stats-grid">
          {communityStats.map((item) => (
            <article key={item.id} className="community-hero-stat">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </header>

      {note ? <p className="success-text">{note}</p> : null}

      <section className="community-body-layout">
        <div className="community-main-column">
          <div className="community-tabs">
            {communityTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`community-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setNote(`${tab} view selected.`);
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <section className="community-composer-card">
            <div className="community-composer-row">
              <div className="community-avatar-badge">A</div>
              <input
                value={composerText}
                onChange={(event) => setComposerText(event.target.value)}
                placeholder="Share your pet story, tips, or ask questions..."
              />
            </div>
            <div className="community-composer-actions">
              <div className="community-composer-tools">
                <button type="button" onClick={() => setShowCreateModal(true)}>Photo</button>
                <button type="button" onClick={() => setShowCreateModal(true)}>Video</button>
              </div>
              <button type="button" className="community-post-button" onClick={handleComposerPost}>
                Post
              </button>
            </div>
          </section>

          <section className="community-feed-list">
            {visiblePosts.map((post) => (
              <article key={post.id} className="community-feed-card">
                <div className="community-feed-head">
                  <div className="community-feed-user">
                    <img src={post.avatar} alt={post.author} />
                    <div>
                      <div className="community-feed-title-row">
                        <strong>{post.author}</strong>
                        {post.role ? <span>{post.role}</span> : null}
                      </div>
                      <p>{post.time} • {post.location} • {post.followers}</p>
                    </div>
                  </div>
                  <button type="button" className="community-dot-button" onClick={() => setNote("Post options opened.")}>
                    ...
                  </button>
                </div>

                <p className="community-feed-copy">{post.copy}</p>
                <div className="community-feed-tags">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                {post.image ? <img src={post.image} alt={post.author} className="community-feed-image" /> : null}

                <div className="community-feed-meta">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                  {post.shared ? <em>Shared</em> : null}
                </div>

                <div className="community-feed-actions">
                  <button type="button" className={post.liked ? "active" : ""} onClick={() => handleLike(post.id)}>
                    Like
                  </button>
                  <button type="button" onClick={() => handleOpenComment(post.id)}>
                    Comment
                  </button>
                  <button type="button" className={post.shared ? "active" : ""} onClick={() => handleShare(post.id)}>
                    {post.shared ? "Shared" : "Share"}
                  </button>
                  <button type="button" className={post.saved ? "active" : ""} onClick={() => handleSave(post.id)}>
                    {post.saved ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>

        <aside className="community-side-column">
          <section className="community-search-card">
            <label className="community-search-shell">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search community..."
              />
              <span>⌕</span>
            </label>
            <button type="button" className="community-filter-button" onClick={() => setShowFilterModal(true)}>
              Advanced Filters
            </button>
          </section>

          <section className="community-topics-card">
            <h2>Popular Topics</h2>
            <div className="community-topic-list">
              {topicList.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`community-topic-item tone-${topic.tone}`}
                  onClick={() => {
                    setFilterState((current) => ({ ...current, category: topic.title }));
                    setNote(`${topic.title} filter selected.`);
                  }}
                >
                  <div>
                    <strong>{topic.title}</strong>
                    <p>{topic.count}</p>
                  </div>
                  <span>›</span>
                </button>
              ))}
            </div>
          </section>

          <section className="community-trending-card">
            <h2>Trending Now</h2>
            <div className="community-trending-list">
              {trendingTags.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="community-trending-item"
                  onClick={() => {
                    setSearchQuery(item.tag);
                    setNote(`${item.tag} added to search.`);
                  }}
                >
                  <strong>{item.tag}</strong>
                  <span>{item.uses}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="community-insight-card">
            <h2>Community Snapshot</h2>
            <p>{appPosts.length || 2} featured posts in your network</p>
            <small>{data.stats.unreadMessages} unread care chats and active discussions today.</small>
          </section>
        </aside>
      </section>

      {showCreateModal ? (
        <div className="community-modal-overlay" role="presentation" onClick={() => setShowCreateModal(false)}>
          <div className="community-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="community-modal-head">
              <h2>Create New Post</h2>
              <button type="button" className="community-modal-close" onClick={() => setShowCreateModal(false)}>X</button>
            </div>

            <label className="community-modal-field">
              <span>What's on your mind?</span>
              <textarea
                value={createDraft}
                onChange={(event) => setCreateDraft(event.target.value)}
                placeholder="Share your pet story, tips, or ask questions..."
              />
            </label>

            <label className="community-modal-field">
              <span>Add Tags</span>
              <input
                value={createTags}
                onChange={(event) => setCreateTags(event.target.value)}
                placeholder="Add tags..."
              />
            </label>

            <div className="community-modal-tools">
              <button type="button" onClick={() => setNote("Photo option opened.")}>Add Photo</button>
              <button type="button" onClick={() => setNote("Video option opened.")}>Add Video</button>
              <button type="button" onClick={() => setCreateDraft((current) => `${current}${current ? " " : ""}🙂`)}>Emoji</button>
            </div>

            <div className="community-modal-actions">
              <button type="button" className="community-secondary-button" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button type="button" className="community-primary-button" onClick={handlePublishPost}>
                Publish Post
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showFilterModal ? (
        <div className="community-modal-overlay" role="presentation" onClick={() => setShowFilterModal(false)}>
          <div className="community-modal-card compact" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="community-modal-head">
              <h2>Advanced Filters</h2>
              <button type="button" className="community-modal-close" onClick={() => setShowFilterModal(false)}>X</button>
            </div>

            <label className="community-modal-field">
              <span>Sort By</span>
              <select value={filterState.sortBy} onChange={(event) => setFilterState((current) => ({ ...current, sortBy: event.target.value }))}>
                <option>Most Recent</option>
                <option>Most Liked</option>
                <option>Most Commented</option>
              </select>
            </label>
            <label className="community-modal-field">
              <span>Category</span>
              <select value={filterState.category} onChange={(event) => setFilterState((current) => ({ ...current, category: event.target.value }))}>
                <option>All Categories</option>
                {topicList.map((topic) => (
                  <option key={topic.id}>{topic.title}</option>
                ))}
              </select>
            </label>
            <label className="community-modal-field">
              <span>Location</span>
              <select value={filterState.location} onChange={(event) => setFilterState((current) => ({ ...current, location: event.target.value }))}>
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Delhi</option>
                <option>Pune</option>
              </select>
            </label>
            <label className="community-modal-field">
              <span>Time Range</span>
              <select value={filterState.timeRange} onChange={(event) => setFilterState((current) => ({ ...current, timeRange: event.target.value }))}>
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </label>

            <div className="community-modal-actions">
              <button
                type="button"
                className="community-secondary-button"
                onClick={() => {
                  setFilterState(filterInitialState);
                  setNote("Filters reset.");
                }}
              >
                Reset
              </button>
              <button type="button" className="community-primary-button" onClick={handleApplyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showCommentModal && selectedPost ? (
        <div className="community-modal-overlay" role="presentation" onClick={() => setShowCommentModal(false)}>
          <div className="community-modal-card compact" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="community-modal-head">
              <h2>Add Comment</h2>
              <button type="button" className="community-modal-close" onClick={() => setShowCommentModal(false)}>X</button>
            </div>

            <div className="community-comment-preview">
              {selectedPost.copy}
            </div>

            <label className="community-modal-field">
              <span>Write your comment</span>
              <textarea
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="Write your comment..."
              />
            </label>

            <div className="community-modal-actions">
              <button type="button" className="community-secondary-button" onClick={() => setShowCommentModal(false)}>
                Cancel
              </button>
              <button type="button" className="community-primary-button" onClick={handlePostComment}>
                Post Comment
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
