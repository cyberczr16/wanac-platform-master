
import ExperienceDetailsPage from "../../components/ExperienceDetails";

export default async function ExperienceDetailsRoutePage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const experienceId = params?.experienceId;
  const fireteamId = searchParams?.fireteamId || null;

  return (
    <ExperienceDetailsPage experienceId={experienceId} fireteamId={fireteamId} />
  );
}
