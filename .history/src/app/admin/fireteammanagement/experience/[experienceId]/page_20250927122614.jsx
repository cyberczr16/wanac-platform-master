import ExperienceDetailsPage from "../../../../../components/ExperienceDetails";

export default function ExperienceDetailsRoutePage(props) {
  // Next.js dynamic route: /admin/fireteammanagement/experience/[experienceId]
  // fireteamId is passed as a query param
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const fireteamId = searchParams ? searchParams.get("fireteamId") : null;
  // experienceId from route param
  const experienceId = props.params?.experienceId;

  return (
    <ExperienceDetailsPage experienceId={experienceId} fireteamId={fireteamId} />
  );
}
