"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDoctors } from "@/app/(commonLayout)/consultation/_actions";
import { useQuery } from "@tanstack/react-query";

const DoctorList = () => {
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  return (
    <div>
      {data.data.map((doctor: any) => {
        return <div key={doctor.id}>{doctor.name}</div>;
      })}
    </div>
  );
};

export default DoctorList;
