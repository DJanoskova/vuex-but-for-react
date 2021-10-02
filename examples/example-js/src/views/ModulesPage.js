import {useActionOnMount, useGetter} from 'vuex-but-for-react';

const ModulesPage = () => {
  useActionOnMount('projects/PROJECTS_FETCH');
  const projects = useGetter('projects/projects');

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}

export default ModulesPage;
