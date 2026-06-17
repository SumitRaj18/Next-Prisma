import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";

interface PageProps {
    id: string;
}

interface Author {
    Name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: Author;
}

interface ResponseData {
    success: boolean;
    msg: string;
    post: Post;
}

// Next.js Server Components receive params as a Promise
async function GetData({ params }: { params: Promise<PageProps> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    
    // Forwarding cookies properly to ensure API authentication works server-side
    const cookieHeader = cookieStore.getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");
    
    try {
        const { data } = await axios.get<ResponseData>(
            `http://localhost:3000/api/post/${id}`,
            { headers: { Cookie: cookieHeader } }
        );
        
        const post = data.post;

        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
                
                {/* Header Navbar */}
                <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link 
                            href="/" 
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors group"
                        >
                            <span className="transform group-hover:-translate-x-0.5 transition-transform">&larr;</span> Back to Dashboard
                        </Link>
                        <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                            Article #{post.id}
                        </span>
                    </div>
                </nav>

                {/* Article Reader Container */}
                <main className="max-w-3xl mx-auto px-4 mt-10">
                    <article className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-8 sm:p-12">
                        
                        {/* Meta Category Tag */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                            Technical Publication
                        </span>

                        {/* Title */}
                        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        {/* Author Info Row */}
                        <div className="mt-6 flex items-center gap-3 pb-6 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                                {post.author?.Name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {post.author?.Name || "Anonymous Author"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Published via DevSpace Studio
                                </p>
                            </div>
                        </div>

                        {/* Main Body Content */}
                        <div className="mt-8 prose prose-slate max-w-none">
                            <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                                {post.content || "This article contains no descriptive body content."}
                            </p>
                        </div>

                    </article>
                </main>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch post:", error);
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Failed to load content</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        We couldn't retrieve the requested resource. It may have been deleted, or you might not have authorization to view it.
                    </p>
                    <Link 
                        href="/" 
                        className="mt-6 inline-block w-full py-2 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }
}

export default GetData;