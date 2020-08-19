import React, { Component } from 'react'
import configuration from '../../Configuration';
import { Link } from 'react-router-dom';

class TemplatesList extends Component {
    state = {
        templates: []
    }

    componentDidMount() {
        document.title = 'Project templates | ReconMap';

        fetch(`${configuration.api.baseUrl}/projects?isTemplate=1`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ templates: data }));
    }

    render() {
        return (
            <>
                <div className='heading'>
                    <h1>Project templates</h1>
                    <button ><i data-feather='plus' className='mr-2'/> Create Template</button>
                </div>
                <section className='flex flex-wrap gap-4'>

                    {
                        this.state.templates.map((template, index) =>
                            <Link to={`/dashboard/project/${index}`}>
                                <article className='base base-project'>
                                    <div className=' mb-auto flex flex-col gap-1'>
                                        <button href="project.html">Create project using template</button>
                                        <button href="clone.html">Clone</button>

                                    </div>
                                    <div className='base-desc gap-3 flex-row flex'>
                                        <span className='text-red-600'>3 tasks</span>
                                            <span className=''>java</span>
                                            <span className=''>local</span>
                                    </div>
                                    <h4 className='base-title'>{template.name}</h4>
                                </article>
                            </Link>

                        )
                    }
                </section>

            </>
        )
    }
}

export default TemplatesList
