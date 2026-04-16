
import ExperienceDetailsPage from "../../components/ExperienceDetails";

export default async function ExperienceDetailsRoutePage(props) {
  const { params, searchParams } = props;
  const experienceId = params?.experienceId;
  const fireteamId = searchParams?.fireteamId || null;

  return (
    <ExperienceDetailsPage experienceId={experienceId} fireteamId={fireteamId} />
  );
}
