import {useState, useEffect} from 'react';
import { isAuth, getCookie } from '../../actions/auth';
import Router from "next/router";
import { createTag, getTags, singleTag, removeTag } from '../../actions/tag';

const Tag = () => {
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    });

    const { name, error, success, tags, removed, reload} = values;
    const token = getCookie('token');

    useEffect(()=>{
        loadtags()
    },[reload]);

    const loadtags = () => {
        getTags()
        .then((data)=>{
            if(data.error){
                setValues({...values, error: data.error});
            } else {
                setValues({...values, tags: data, error: false});
            }
        })
    };

    const showTags = () => {
        return tags.map((c, i)=>{
            return <button onDoubleClick={()=>deleteConfirm(c.slug)} title="Double click to delete" key={i} className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</button>
        });
    };
    const deleteConfirm=(slug)=>{
        let answer = window.confirm('are you sure you want to delete the tag?');
        if(answer){
            deleteTag(slug);
        }
    };
    const showSuccess = ()=>{
        if(success){
            return <p className="text-success">Tag is created !</p>;
        }
    }
    const showError = ()=>{
        if(error){
            return <p className="text-danger">Tag exists !</p>;
        }
    }
    const showRemoved = ()=>{
        if(removed){
            return <p className="text-success">Tag is removed !</p>;
        }
    }
    const omMouseMoveHandler = () =>{
        setValues({...values, error: false, success: false, removed: false});
    }
    const deleteTag=(slug)=>{
        removeTag(slug, token)
        .then((data)=>{
            if(data.error){
                console.log(data.error);
            }else {
                setValues({...values, error: false, success: false, name: '', removed: !removed, reload: !reload});
            }
        })
    }
    const clickSubmit = (e) => {
        e.preventDefault();

        createTag({name}, token)
        .then(data => {
            if (data) {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false });
                } else {
                    setValues({
                        ...values,
                        name: '',
                        error: false,
                        success: true,
                        removed: false,
                        reload: !reload
                    });
                }
            }
        })
    }
    const handleChange = (name) => (e) => {
        setValues({...values, [name]: e.target.value, error: false, sucess: false});
    }

    const newTagForm = () => {
        return (
            <form onSubmit={clickSubmit}>
                <div className="form-group">
                    <label className="text-muted">Tag Name</label>
                    <input type="text" className="form-control" onChange={handleChange('name')} value={name} required/>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        );
    }
    return (
        <React.Fragment>
            {showSuccess()}
            {showError()}
            {showRemoved()}
            <div onMouseMove={omMouseMoveHandler}>
                {newTagForm()}
                {showTags()}</div>
        </React.Fragment>
    );
}

export default Tag;