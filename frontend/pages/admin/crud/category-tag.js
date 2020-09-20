import Layout from '../../../components/Layout';
import Link from 'next/link';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';

const CategoryTag = () => {
    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 pt-5 pb-5">
                        <h2>Modify Categories and Tags</h2>
                    </div>
                    <div className="col-md-6">
                        <Category/>
                    </div>
                    <div className="col-md-6">
                        <Tag/>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CategoryTag;