

"use client";
import ExperienceDetailsPage from "../../components/ExperienceDetails";

export default function ExperienceDetailsRoutePage(props) {
  const params = React.use(props.params);
  const experienceId = params?.experienceId;
  const searchParams = React.use(props.searchParams);
  const fireteamId = searchParams?.fireteamId || null;

  return (
    <ExperienceDetailsPage experienceId={experienceId} fireteamId={fireteamId} />
  );
}
