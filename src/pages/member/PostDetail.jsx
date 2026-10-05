import React from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import PostDetailCore from '../../components/home/PostDetailCore';

function PostDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />
      <PostDetailCore isGuest={false} />
      <AIChatbot />
      <Footer />
    </div>
  );
}

export default PostDetail;
