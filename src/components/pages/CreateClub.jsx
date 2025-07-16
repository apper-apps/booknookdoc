import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Badge from "@/components/atoms/Badge";

const CreateClub = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    genre: "",
    privacy: "public",
    welcomeMessage: "",
    rules: "",
    currentBook: "",
    bannerImage: null,
    bannerColor: "#FF6B6B",
    theme: "cozy"
  });

  const [imagePreview, setImagePreview] = useState(null);

  const genres = [
    "Fantasy", "Romance", "Young Adult", "Science Fiction", "Mystery", 
    "Thriller", "Contemporary", "Historical Fiction", "LGBTQ+", "Horror",
    "Non-Fiction", "Biography", "Self-Help", "Poetry", "Classics"
  ];

  const themes = [
    { id: "cozy", name: "Cozy Library", description: "Warm and inviting atmosphere" },
    { id: "modern", name: "Modern Minimalist", description: "Clean and contemporary" },
    { id: "vintage", name: "Vintage Bookshop", description: "Classic and timeless" },
    { id: "magical", name: "Magical Realm", description: "Enchanted and mystical" },
    { id: "academic", name: "Academic Study", description: "Scholarly and refined" }
  ];

  const privacyOptions = [
    {
      id: "public",
      name: "Public",
      description: "Anyone can find and join your club",
      icon: "Globe"
    },
    {
      id: "private",
      name: "Private",
      description: "Only invited members can join",
      icon: "Lock"
    },
    {
      id: "invite-only",
      name: "Invite Only",
      description: "Members must request to join",
      icon: "UserCheck"
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, bannerImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Club created successfully!");
      navigate("/clubs");
    } catch (error) {
      toast.error("Failed to create club. Please try again.");
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.description.trim() && formData.genre;
      case 2:
        return formData.privacy && formData.welcomeMessage.trim();
      case 3:
        return formData.theme;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <Card variant="elevated">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">
            Basic Information
          </h2>
          <p className="text-primary/70">
            Let's start with the basics about your book club
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Club Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your club name"
              maxLength={50}
            />
            <p className="text-xs text-primary/60 mt-1">
              {formData.name.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what your club is about..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-primary/60 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Primary Genre *
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={formData.genre === genre ? "accent" : "secondary"}
                  size="sm"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => handleInputChange("genre", genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Current Book (Optional)
            </label>
            <Input
              value={formData.currentBook}
              onChange={(e) => handleInputChange("currentBook", e.target.value)}
              placeholder="What book is your club currently reading?"
            />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderStep2 = () => (
    <Card variant="elevated">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">
            Privacy & Rules
          </h2>
          <p className="text-primary/70">
            Set up how your club will operate
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Privacy Setting *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {privacyOptions.map((option) => (
                <Card
                  key={option.id}
                  variant={formData.privacy === option.id ? "elevated" : "interactive"}
                  className={`cursor-pointer transition-all ${
                    formData.privacy === option.id
                      ? "ring-2 ring-accent/50 bg-accent/5"
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => handleInputChange("privacy", option.id)}
                >
                  <div className="text-center space-y-2">
                    <ApperIcon name={option.icon} size={24} className="mx-auto text-accent" />
                    <div>
                      <div className="font-medium text-primary">{option.name}</div>
                      <div className="text-xs text-primary/60">{option.description}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Welcome Message *
            </label>
            <Textarea
              value={formData.welcomeMessage}
              onChange={(e) => handleInputChange("welcomeMessage", e.target.value)}
              placeholder="Write a welcome message for new members..."
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-primary/60 mt-1">
              {formData.welcomeMessage.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Club Rules (Optional)
            </label>
            <Textarea
              value={formData.rules}
              onChange={(e) => handleInputChange("rules", e.target.value)}
              placeholder="Add any specific rules or guidelines for your club..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-primary/60 mt-1">
              {formData.rules.length}/1000 characters
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card variant="elevated">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">
            Customize Appearance
          </h2>
          <p className="text-primary/70">
            Make your club visually appealing
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Banner Image (Optional)
            </label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, bannerImage: null }));
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
                      <p className="text-primary/70">Upload a banner image</p>
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
                id="banner-upload"
              />
              <Button
                variant="ghost"
                onClick={() => document.getElementById('banner-upload').click()}
                className="w-full"
              >
                <ApperIcon name="Upload" size={16} className="mr-2" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Banner Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.bannerColor}
                onChange={(e) => handleInputChange("bannerColor", e.target.value)}
                className="w-12 h-12 rounded-lg border border-primary/30 cursor-pointer"
              />
              <span className="text-primary/70">{formData.bannerColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Club Theme *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <Card
                  key={theme.id}
                  variant={formData.theme === theme.id ? "elevated" : "interactive"}
                  className={`cursor-pointer transition-all ${
                    formData.theme === theme.id
                      ? "ring-2 ring-accent/50 bg-accent/5"
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => handleInputChange("theme", theme.id)}
                >
                  <div className="space-y-2">
                    <div className="font-medium text-primary">{theme.name}</div>
                    <div className="text-xs text-primary/60">{theme.description}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/clubs")}
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Clubs
          </Button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === step ? "bg-accent" : i < step ? "bg-success" : "bg-primary/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Create Your Book Club
          </h1>
          <p className="text-primary/70">
            Step {step} of 3
          </p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </motion.div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevStep}
            disabled={step === 1}
          >
            <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
            Previous
          </Button>

          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!isStepValid()}
          >
            {step === 3 ? "Create Club" : "Next"}
            <ApperIcon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateClub;