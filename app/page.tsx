'use client'
import axios from "axios";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface AuthorType { Name: string; }
interface PostType {
  title: string;
  content: string;
  id: number;
  image?: string;
  author: AuthorType;
}
interface ResponseType {
  success: boolean;
  post: PostType[];
  total: number;
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  
  // Pagination & Data States
  const [post, setPost] = useState<PostType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  // Main data fetching logic
  const GetPosts = async (pageToFetch: number, isRefresh = false) => {
    try {
      const res = await axios.get<ResponseType>(
        `/api/post?page=${pageToFetch}&limit=${limit}`, 
        { withCredentials: true }
      );
      
      if (res.data.success) {
        if (isRefresh) {
          // Fresh reset (on initial load or when a new post is created)
          setPost(res.data.post);
          setPage(2);
          setHasMore(Number(res.data.total) > res.data.post.length);
        } else {
          // Normal infinite scroll appending
          const nextPosts = [...post, ...res.data.post];
          setPost(nextPosts);
          setPage((prev) => prev + 1);
          setHasMore(nextPosts.length < Number(res.data.total));
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    GetPosts(1, true);
  }, []);

  // Form handling
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const res = await axios.post('/api/post', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data.success) {
        setTitle('');
        setContent('');
        setImage(null);
        // Refresh the entire feed starting back from page 1
        GetPosts(1, true); 
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form Sticky Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="What's on your mind?" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Content</label>
                <textarea 
                  placeholder="Share your thoughts..." 
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)} 
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cover Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? "Uploading Media..." : "Publish Post"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Feed Stream Column */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">All Publications</h1>

          {post.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 p-12 rounded-2xl text-center text-slate-400">
              No articles found.
            </div>
          ) : (
            <InfiniteScroll
              dataLength={post.length}
              next={() => GetPosts(page, false)}
              hasMore={hasMore}
              loader={<div className="text-center py-4 text-sm font-medium text-slate-400">Loading more posts...</div>}
              endMessage={<p className="text-center py-6 text-sm text-slate-400 font-semibold">You have caught up with everything! 🎉</p>}
              className="space-y-4 !overflow-visible"
            >
              {post.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between group">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h2>
                    
                    {item.image && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 max-w-xl max-h-72 bg-slate-50 aspect-[16/10]">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transform hover:scale-[1.01] transition-all duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <p className="text-slate-600 text-sm mt-2 line-clamp-3 leading-relaxed">{item.content}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Created by <strong className="text-slate-700 font-medium">{item.author?.Name || "Anonymous"}</strong></span>
                    <Link href={`/${item.id}`} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>

      </main>
    </div>
  );
}