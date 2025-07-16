import discussionsData from "@/services/mockData/discussions.json";

class DiscussionService {
  constructor() {
    this.discussions = [...discussionsData];
  }
  
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.discussions]);
      }, 300);
    });
  }
  
  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const discussion = this.discussions.find(d => d.Id === parseInt(id));
        resolve(discussion ? { ...discussion } : null);
      }, 200);
    });
  }
  
  async getByClubId(clubId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clubDiscussions = this.discussions.filter(d => d.clubId === parseInt(clubId));
        resolve(clubDiscussions);
      }, 300);
    });
  }
  
  async create(discussionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDiscussion = {
          ...discussionData,
          Id: Math.max(...this.discussions.map(d => d.Id)) + 1,
          comments: [],
          likes: 0,
          createdAt: new Date().toISOString(),
        };
        this.discussions.push(newDiscussion);
        resolve({ success: true, discussion: newDiscussion });
      }, 300);
    });
  }
  
  async addComment(discussionId, commentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const discussion = this.discussions.find(d => d.Id === parseInt(discussionId));
        if (discussion) {
          const newComment = {
            ...commentData,
            Id: Date.now(),
            createdAt: new Date().toISOString(),
            likes: 0,
            replies: [],
          };
          discussion.comments.push(newComment);
          resolve({ success: true, comment: newComment });
        } else {
          resolve({ success: false, error: "Discussion not found" });
        }
      }, 200);
    });
  }
  
  async addReply(commentId, replyData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find comment in any discussion
        let targetComment = null;
        for (const discussion of this.discussions) {
          targetComment = this.findCommentById(discussion.comments, parseInt(commentId));
          if (targetComment) break;
        }
        
        if (targetComment) {
          const newReply = {
            ...replyData,
            Id: Date.now(),
            createdAt: new Date().toISOString(),
            likes: 0,
            replies: [],
          };
          targetComment.replies.push(newReply);
          resolve({ success: true, reply: newReply });
        } else {
          resolve({ success: false, error: "Comment not found" });
        }
      }, 200);
    });
  }
  
  findCommentById(comments, id) {
    for (const comment of comments) {
      if (comment.Id === id) return comment;
      if (comment.replies) {
        const found = this.findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  }
  
  async getRecentActivity() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recent = [...this.discussions]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        resolve(recent);
      }, 300);
    });
  }
}

export default new DiscussionService();