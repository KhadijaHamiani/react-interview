import { useEffect, useMemo, useState } from 'react';
import { uniqBy } from 'lodash';
import {
  Card,
  Row,
  Col,
  notification,
  Empty,
  Tag,
  Select,
  Spin,
  Pagination,
} from 'antd';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, remove, like, dislike } from '../store/reducers';

import './movies.css';

const Movies = () => {
  const dispatch = useDispatch();
  const [moviesCategory, setMoviesCategory] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const { data, status } = useSelector((state) => state.movies);

  const onRemove = (id) => {
    dispatch(remove(id));
    notification.open({
      type: 'success',
      message: 'The movie has been deleted successfully',
    });
  };
  const onLike = (id) => dispatch(like(id));
  const onDislike = (id) => dispatch(dislike(id));
  const categories = useMemo(
    () =>
      uniqBy(data, 'category').map(({ category }) => ({
        label: category,
        value: category,
      })),
    [data]
  );
  const movies = useMemo(
    () =>
      moviesCategory.length >= 1
        ? data.filter((movie) => moviesCategory.includes(movie.category))
        : data,
    [data, moviesCategory]
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (status === 'idle') return <Spin className="spinner" />;
  if (data.length <= 0) return <Empty description={'No movies'} />;

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>précédent</a>;
    }
    if (type === 'next') {
      return <a>suivant</a>;
    }
    return originalElement;
  };
  return (
    <div className={'container_antd'}>
      <Row align={'middle'} justify="center">
        <Select
          mode="multiple"
          allowClear
          style={{
            width: '50%',
            marginBottom: 30,
          }}
          onChange={setMoviesCategory}
          placeholder="Please select"
          options={categories}
        />
      </Row>

      <Row align={'middle'} justify="center">
        {movies
          .slice((page - 1) * pageSize, page * pageSize)
          .map(({ id, title, likes, dislikes, category }) => (
            <Col
              key={id}
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
              style={{ padding: '8px' }}
            >
              <Card
                title={title}
                extra={
                  <IoIosRemoveCircleOutline
                    size={20}
                    color={'red'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onRemove(id)}
                  />
                }
                children={
                  <Row align={'middle'} justify="center">
                    {category}
                  </Row>
                }
                actions={[
                  <Tag onClick={() => onLike(id)}>
                    <Row align={'middle'} justify="start">
                      <AiOutlineLike size={20} />
                      {likes}
                    </Row>
                  </Tag>,
                  <Tag onClick={() => onDislike(id)}>
                    <Row align={'middle'} justify="start">
                      <AiOutlineDislike size={20} />
                      {dislikes}
                    </Row>
                  </Tag>,
                ]}
              />
            </Col>
          ))}
      </Row>
      <Row justify={'center'}>
        <Pagination
          style={{ position: 'fixed',bottom:'22px' }}
          total={data.length}
          showLessItems
          itemRender={itemRender}
          current={page}
          pageSize={pageSize}
          onShowSizeChange={(_, size) => {
            setPageSize(size);
          }}
          onChange={setPage}
          showSizeChanger
          pageSizeOptions={[4, 8, 12]}
        />
      </Row>
    </div>
  );
};

export default Movies;
