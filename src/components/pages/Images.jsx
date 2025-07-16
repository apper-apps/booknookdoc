import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Badge from "@/components/atoms/Badge";
import ImageCard from "@/components/molecules/ImageCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useImages } from "@/hooks/useImages";

const Images = () => {
  const { images, loading, error, uploadImage, likeImage, addComment, searchImages } = useImages();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [uploadData, setUploadData] = useState({
    caption: "",
    type: "shelfie",
    tags: "",
    bookTags: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const imageTypes = [
    { id: "all", name: "All", icon: "Grid" },
    { id: "shelfie", name: "Shelfies", icon: "BookOpen" },
    { id: "quote", name: "Quotes", icon: "Quote" },
    { id: "fanart", name: "Fan Art", icon: "Palette" },
    { id: "meme", name: "Memes", icon: "Smile" }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setUploadData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.image || !uploadData.caption.trim()) {
      toast.error("Please add an image and caption");
      return;
    }

    setIsUploading(true);
    
    try {
      const imageData = {
        url: imagePreview, // In real app, this would be uploaded to server
        caption: uploadData.caption,
        type: uploadData.type,
        tags: uploadData.tags ? uploadData.tags.split(",").map(tag => tag.trim()) : [],
        bookTags: uploadData.bookTags ? uploadData.bookTags.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        userId: "user1"
      };

      const success = await uploadImage(imageData);
      
      if (success) {
        toast.success("Image uploaded successfully!");
        setShowUploadForm(false);
        setUploadData({
          caption: "",
          type: "shelfie",
          tags: "",
          bookTags: "",
          image: null
        });
        setImagePreview(null);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = selectedType !== "all" ? { type: selectedType } : {};
    searchImages(searchQuery, filters);
  };

  const handleLike = async (imageId) => {
    await likeImage(imageId);
  };

  const handleComment = async (imageId, commentData) => {
    await addComment(imageId, commentData);
  };

  const filteredImages = selectedType === "all" 
    ? images 
    : images.filter(img => img.type === selectedType);

  if (loading && !images.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Loading variant="default" />
        </div>
      </div>
    );
  }

  if (error && !images.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Error message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">
              Image Gallery
            </h1>
            <p className="text-primary/70 mt-1">
              Share your reading moments with the community
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Upload Image
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated">
              <form onSubmit={handleSubmitUpload} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-semibold text-primary">
                    Upload New Image
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUploadForm(false)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-primary">
                    Image *
                  </label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-60 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setImagePreview(null);
                            setUploadData(prev => ({ ...prev, image: null }));
                          }}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <ApperIcon name="X" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ApperIcon name="Upload" size={48} className="mx-auto text-primary/40" />
                        <div>
                          <p className="text-primary/70">Upload an image</p>
                          <p className="text-xs text-primary/50">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => document.getElementById('image-upload').click()}
                    className="w-full"
                  >
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    {imagePreview ? "Change Image" : "Select Image"}
                  </Button>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Caption *
                  </label>
                  <Textarea
                    value={uploadData.caption}
                    onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Describe your image..."
                    rows={3}
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-primary/60 mt-1">
                    {uploadData.caption.length}/500 characters
                  </p>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {imageTypes.slice(1).map((type) => (
                      <Badge
                        key={type.id}
                        variant={uploadData.type === type.id ? "accent" : "secondary"}
                        size="sm"
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => setUploadData(prev => ({ ...prev, type: type.id }))}
                      >
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={uploadData.tags}
                    onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="reading, cozy, fantasy..."
                  />
                </div>

                {/* Book Tags */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Book IDs (comma-separated)
                  </label>
                  <Input
                    value={uploadData.bookTags}
                    onChange={(e) => setUploadData(prev => ({ ...prev, bookTags: e.target.value }))}
                    placeholder="1, 2, 3..."
                  />
                  <p className="text-xs text-primary/60 mt-1">
                    Link this image to specific books
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isUploading || !uploadData.image || !uploadData.caption.trim()}
                  >
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Search and Filter */}
        <Card variant="flat">
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="flex-1"
              />
              <Button type="submit" variant="primary">
                <ApperIcon name="Search" size={16} />
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {imageTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant={selectedType === type.id ? "accent" : "secondary"}
                  size="sm"
                  className="cursor-pointer hover:opacity-80 flex items-center gap-1"
                  onClick={() => setSelectedType(type.id)}
                >
                  <ApperIcon name={type.icon} size={12} />
                  {type.name}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Image" size={64} className="mx-auto text-primary/40 mb-4" />
            <h3 className="text-lg font-serif font-semibold text-primary mb-2">
              No images found
            </h3>
            <p className="text-primary/70 mb-4">
              {searchQuery ? "Try adjusting your search" : "Be the first to share an image!"}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => setShowUploadForm(true)}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Upload Image
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.Id}
                image={image}
                onLike={handleLike}
                onComment={handleComment}
                showUser={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;