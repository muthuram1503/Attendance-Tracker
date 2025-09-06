

import { useRouter } from "next/navigation";

export default function SideNav({ collectionName }) {
  const router = useRouter();

  const handleDashboardClick = () => {
    if (collectionName) {
      router.push(`/dashboard/add-subject/${collectionName}/dash`);
    } else {
      alert("Please select a subject first");
    }
  };

  return (
    <nav>
      <button onClick={handleDashboardClick} className="flex items-center space-x-2">
        <span>📊</span>
        <span>Dashboard</span>
      </button>
    </nav>
  );
}

