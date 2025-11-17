import hamzaProfile from "@/assets/hamza-profile.jpg";

const AcademicBanner = () => {
  return (
    <section className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <img 
                src={hamzaProfile} 
                alt="Mohammad Hamza Siddiqui" 
                className="w-32 h-32 rounded-full object-cover border-2 border-primary/20" 
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-muted-foreground mb-2 text-xs">
                Engineered in partial fulfilment of the requirements for the AI Assignment under the course Introduction to Marketing Management    
              </p>
              <h3 className="text-lg font-semibold mb-2">
                Indian Institute of Management Ranchi
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                <span className="font-medium">Faculty:</span> Prof. Shweta Jha
              </p>
              <div className="text-sm">
                <p className="font-medium text-foreground">Mohammad Hamza Siddiqui</p>
                <p className="text-muted-foreground">IPM29-24</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademicBanner;
