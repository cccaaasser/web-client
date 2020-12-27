import React, {useEffect, useState} from 'react'
import secureApiFetch from '../../services/api'
import SecondaryButton from '../ui/buttons/Secondary'
import PrimaryButton from '../ui/buttons/Primary'
import {IconCheck, IconClipboard, IconUpload, IconX} from '../ui/Icons'
import Title from './../ui/Title'
import ButtonGroup from "../ui/buttons/ButtonGroup";
import DeleteButton from "../ui/buttons/Delete";
import Breadcrumb from "../ui/Breadcrumb";
import Loading from '../ui/Loading'
import Timestamps from "../ui/Timestamps";
import toast, {actionCompletedToast} from "../ui/toast";
import TaskStatusBadge from '../badges/TaskStatusBadge'
import useFetch from './../../hooks/useFetch'
import useDelete from '../../hooks/useDelete'
import {Link} from "react-router-dom";
import ShellCommand from "../ui/ShellCommand";
import TextBlock from "../ui/TextBlock";

const TaskDetails = ({history, match}) => {
    const taskId = match.params.id;
    const [task, fetchTask] = useFetch(`/tasks/${taskId}`)
    const [users] = useFetch(`/users`)
    const [results] = useFetch(`/tasks/${taskId}/results`)
    const [project, setProject] = useState(null);
    const destroy = useDelete('/tasks/', fetchTask);

    const handleToggle = (task) => {
        secureApiFetch(`/tasks/${task.id}`, {
            method: 'PATCH',
            body: JSON.stringify({completed: task.completed ? '0' : '1'})
        })
            .then(() => {
                fetchTask()
                toast('Task', 'Status changed')
            })
            .catch(err => console.error(err))
    }

    const handleDelete = () => {
        destroy(task.id);
        history.push('/tasks');
    }

    const handleAssigneeChange = (ev) => {
        const assigneeUid = ev.target.value;
        secureApiFetch(`/tasks/${task.id}`, {
            method: 'PATCH',
            body: JSON.stringify({assignee_uid: '' === assigneeUid ? null : assigneeUid})
        })
            .then(() => {
                actionCompletedToast("The task has been assigned.");
                fetchTask()
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (task) {
            document.title = `Task ${task.name} | Reconmap`;

            secureApiFetch(`/projects/${task.project_id}`, {method: 'GET'})
                .then(resp => resp.json())
                .then(project => {
                    setProject(project);
                })
                .catch(err => console.error(err))
        }
    }, [task])

    return (
        <div>
            <div className="heading">
                <Breadcrumb>
                    <Link to="/tasks">Tasks</Link>
                    {project && <Link to={`/projects/${project.id}`}>{project.name}</Link>}
                </Breadcrumb>
                {task && users &&
                <ButtonGroup>
                    <label>Assign to&nbsp;
                        <select onChange={handleAssigneeChange} defaultValue={task.assignee_uid}>
                            <option value="">(nobody)</option>
                            {users && users.map((user, index) =>
                                <option key={index} value={user.id}>{user.name}</option>
                            )}
                        </select>
                    </label>
                    {task.completed === 1 && <SecondaryButton onClick={() => handleToggle(task)}>
                        <IconX/> Mark as incomplete
                    </SecondaryButton>}
                    {task.completed !== 1 && <SecondaryButton onClick={() => handleToggle(task)}>
                        <IconCheck/> Mark as completed
                    </SecondaryButton>}
                    <PrimaryButton to={"/tasks/" + task.id + "/upload"}>
                        <IconUpload/> Upload results
                    </PrimaryButton>
                    <DeleteButton onClick={() => handleDelete(task.id)}/>
                </ButtonGroup>
                }
            </div>
            {!task ? <Loading/> :
                <article>
                    <Title title={task.name} type='Task' icon={<IconClipboard/>}/>
                    <Timestamps insertTs={task.insert_ts} updateTs={task.update_ts}/>
                    <h4>Description</h4>
                    <TextBlock value={task.description || "(empty)"}/>
                    <h4>Status</h4>
                    <p style={{display: 'flex', alignItems: 'center', columnGap: 'var(--margin)'}}>
                        <TaskStatusBadge completed={String(task.completed)}/>
                        {String(task.completed) === '1' ? 'Completed' : 'Incomplete'}
                    </p>
                    <h4>Command</h4>
                    {task.command &&
                    <>
                        <ShellCommand>{task.command}</ShellCommand>
                        <h5>Results</h5>
                        {!results ? <Loading/> : results.map((value, index) =>
                            <div key={index} className='pb-2 border-b mb-2'>
                                <label>Date: {value.insert_ts}</label>
                                <textarea readOnly value={value.output} style={{width: '100%'}}/>
                            </div>
                        )}
                        {results && results.length === 0 && 'No results'}
                    </>
                    }
                    {!task.command &&
                    <p>No command defined for this task.</p>
                    }
                </article>
            }
        </div>
    )
}

export default TaskDetails;
