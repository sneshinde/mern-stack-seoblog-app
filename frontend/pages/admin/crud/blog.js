import Layout from '../../../components/Layout';
import CreateBlog from '../../../components/crud/BlogCreate';

const Blog = () => {
    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 pt-5 pb-5">
                        <CreateBlog/>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Blog;