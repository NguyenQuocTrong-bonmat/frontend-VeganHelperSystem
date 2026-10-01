import re

with open('src/pages/member/MyPosts.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add deletePost to imports
if 'deletePost' not in content:
    content = content.replace('getMyPosts', 'getMyPosts, deletePost')

# 2. Add state for delete modal
state_hook = """  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete);
      setPosts(posts.filter(p => p.id !== postToDelete));
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        alert('Unauthorized. Please log in.');
      } else {
        alert('Failed to delete post');
      }
    }
  };
"""
if 'const [deleteModalOpen' not in content:
    content = content.replace('const [statusFilter, setStatusFilter] = useState(\'\'); // Rỗng là lấy tất cả status\n', 'const [statusFilter, setStatusFilter] = useState(\'\'); // Rỗng là lấy tất cả status\n' + state_hook)

# 3. Modify delete button in map
delete_btn = """<button className="p-1 text-text-stem-gray hover:text-accent-beetroot hover:bg-herb-white rounded transition-colors" title="Delete post">"""
if delete_btn in content:
    content = content.replace(delete_btn, """<button onClick={(e) => handleDeleteClick(e, post.id)} className="p-1 text-text-stem-gray hover:text-accent-beetroot hover:bg-herb-white rounded transition-colors" title="Delete post">""")

# 4. Modify modal to use state
if 'id="delete-modal-wrapper"' in content:
    content = re.sub(r'<div aria-hidden="true" className="hidden fixed inset-0.*id="delete-modal-wrapper".*?>',
                     r'<div aria-hidden="true" className={${deleteModalOpen ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center p-4} id="delete-modal-wrapper" role="dialog">',
                     content)

if 'id="delete-modal-backdrop"' in content:
    content = content.replace('id="delete-modal-backdrop"></div>', 'id="delete-modal-backdrop" onClick={() => setDeleteModalOpen(false)}></div>')

cancel_btn = """<button className="bg-transparent border-[1.5px] border-[#2F5233] text-[#2F5233] py-2 px-4 rounded-[8px] 
text-sm font-medium transform-gpu [backface-visibility:hidden] transition-colors duration-200 ease-in-out 
hover:bg-[#2F5233]/5 focus:outline-none" type="button">
                Cancel
              </button>"""
cancel_btn_no_newline = cancel_btn.replace('\n', '')

content = re.sub(r'<button className="bg-transparent border-\[1.5px\] border-\[#2F5233\].*?>\s*Cancel\s*</button>', 
                 '<button onClick={() => setDeleteModalOpen(false)} className="bg-transparent border-[1.5px] border-[#2F5233] text-[#2F5233] py-2 px-4 rounded-[8px] text-sm font-medium transform-gpu [backface-visibility:hidden] transition-colors duration-200 ease-in-out hover:bg-[#2F5233]/5 focus:outline-none" type="button">Cancel</button>',
                 content, flags=re.DOTALL)

content = re.sub(r'<button className="bg-transparent border-\[1.5px\] border-\[#C1432E\].*?>\s*Delete\s*</button>',
                 '<button onClick={confirmDelete} className="bg-transparent border-[1.5px] border-[#C1432E] text-[#C1432E] py-2 px-4 rounded-[8px] text-sm font-medium transform-gpu [backface-visibility:hidden] transition-colors duration-200 ease-in-out hover:bg-[#C1432E]/5 focus:outline-none" type="button">Delete</button>',
                 content, flags=re.DOTALL)

# 5. Fix edit button in map
edit_btn = """<button className="p-1 text-text-stem-gray hover:text-primary-moss hover:bg-herb-white rounded transition-colors" title="Edit post">"""
if edit_btn in content:
    content = content.replace(edit_btn, """<button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(/posts/edit/); }} className="p-1 text-text-stem-gray hover:text-primary-moss hover:bg-herb-white rounded transition-colors" title="Edit post">""")

with open('src/pages/member/MyPosts.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
