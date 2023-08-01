import { prisma } from "@/lib/prisma";

export async function getUsersperMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are zero-based, so add 1 to get the current month

  const year = 2023; // Replace with the dynamic year

  const startDate = new Date(0);
  startDate.setFullYear(year);
  const endDate = new Date(0);
  endDate.setFullYear(year + 1);

  const data = await prisma.user.groupBy({
    by: ["createdAt"],
    // where: {
    //   createdAt: {
    //     gte: new Date(currentDate.getFullYear(), currentMonth - 1, 1), // First day of the current month
    //     lt: new Date(currentDate.getFullYear(), currentMonth, 1), // First day of the next month
    //   },
    // },
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },

    _count: true,
  });

  // console.log("data", data);

  const usersPerMonth = data.reduce(
    (acc, { createdAt, _count }) => {
      const month = createdAt.getMonth();
      acc[month].total += _count;
      return acc;
    },
    [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ]
  );

  return { usersPerMonth };
}
