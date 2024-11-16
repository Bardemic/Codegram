import TutorCard from "@/components/TutorCard";
import Header from "@/components/Header";

export default function Page() {

  return (
    <div>
      <Header />
      <div className="p-10">
        <TutorCard
          avatarUrl="https://via.placeholder.com/150"
          name="Jane Doe"
          subjects={["Python", "C++", "Java"]}
          tutorId={1}
        />
        <TutorCard
          avatarUrl="https://via.placeholder.com/150"
          name="Jane Doe"
          subjects={["Python", "C++", "Java"]}
          tutorId={1}
        />
        <TutorCard
          avatarUrl="https://via.placeholder.com/150"
          name="Jane Doe"
          subjects={["Python", "C++", "Java"]}
          tutorId={1}
        />
      </div>
    </div>
  );
}
