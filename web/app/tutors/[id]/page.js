import { getUserByUsername } from '@/lib/users';
import Header from "@/components/Header";
 
export default async function Page({ params }) {
  const { id } = await params;
  const user = getUserByUsername(id);

  if (user == null || user.params.role !== "tutor") {
    return (
      <div>
        <Header />
        <h1>Tutor doen't exist.</h1>
      </div>
    );
  }

  return <p>Tutor: {id}</p>
}

// export async function getStaticPaths() {
//   const paths = getTutorUsernameIds();
//   return {
//     paths,
//     fallback: false,
//   };
// }