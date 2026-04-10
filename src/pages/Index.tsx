import { useState } from "react";
import { NavCategory } from "@/lib/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { CollegeList } from "@/components/colleges/CollegeList";
import { CollegeRecommender } from "@/components/colleges/CollegeRecommender";
import { ScholarshipList } from "@/components/scholarships/ScholarshipList";
import { AdmissionsInfo } from "@/components/admissions/AdmissionsInfo";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavCategory>("chat");

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />;
      case "colleges":
        return <CollegeList />;
      case "admissions":
        return <AdmissionsInfo />;
      case "scholarships":
        return <ScholarshipList />;
      case "recommend":
        return <CollegeRecommender />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
};

export default Index;
