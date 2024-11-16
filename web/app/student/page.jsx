import TutorCard from "@/components/TutorCard";

export default function Page() {
  const handleInvite = () => {
    alert("Invitation sent!");
  };

  return (
    <div className="p-6">
      <TutorCard
        avatarUrl="https://via.placeholder.com/150"
        name="Jane Doe"
        subjects={["Python", "C++", "Java"]}
        onInvite={handleInvite}
      />
    </div>
  );
};
