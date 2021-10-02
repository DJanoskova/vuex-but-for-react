import { useActionOnMount, useGetter } from 'vuex-but-for-react';

const ModulesPage = () => {
  const projects = useGetter('projects/projects');
  useActionOnMount('projects/PROJECTS_FETCH');

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}

export default ModulesPage;
