

"use client";
import ExperienceDetailsPage from "../../components/ExperienceDetails";

export default function ExperienceDetailsRoutePage(props) {
  const experienceId = props.params?.experienceId;
  const fireteamId = props.searchParams?.fireteamId || null;

  return (
    <ExperienceDetailsPage experienceId={experienceId} fireteamId={fireteamId} />
  );
}
