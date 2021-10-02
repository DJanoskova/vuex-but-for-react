import { useEffect } from 'react';
import { useAction, useGetter } from 'vuex-but-for-react';

const ModulesPage = () => {
  const handleFetch = useAction('projects/PROJECTS_FETCH');
  const projects = useGetter('projects/projects');

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}

export default ModulesPage;
