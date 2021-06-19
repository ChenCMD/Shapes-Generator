export {};
// import React, { useState } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import styles from '../styles/PosParameterBox.module.scss';

// interface PosParameterBoxProps {
//     name: string
//     description: string
//     updateParam: (newParam: string | Pos) => void
//     value: Pos
// }

// const PosParameterBox: React.FC<PosParameterBoxProps> = ({ name, description, updateParam, value }) => {
//     const [xArgValue, setXArgValue] = useState(value.x);
//     const [yArgValue, setYArgValue] = useState(value.y);

//     const onChangeX = (newValue: string) => {
//         setXArgValue(newValue);
//         updateParam({ x: newValue, y: yArgValue });
//     };

//     const onChangeY = (newValue: string) => {
//         setYArgValue(newValue);
//         updateParam({ x: xArgValue, y: newValue });
//     };

//     return (
//         <div className={styles['double-param-box']} title={description}>
//             <div className={styles['double-param-box-name']}>{name}</div>
//             <Container fluid className={styles['double-param-box-inputs']}>
//                 <Row>
//                     <Col xs={2} className={styles['double-param-box-col']}>
//                         <div className={styles['double-param-box-sub-name']}>x</div>
//                     </Col>
//                     <Col xs={4} className={styles['double-param-box-col']}>
//                         <input className={styles['double-param-box-input']} onChange={e => onChangeX(e.target.value)} value={xArgValue} />
//                     </Col>
//                     <Col xs={2} className={styles['double-param-box-col']}>
//                         <div className={styles['double-param-box-sub-name']}>y</div>
//                     </Col>
//                     <Col xs={4} className={styles['double-param-box-col']}>
//                         <input className={styles['double-param-box-input']} onChange={e => onChangeY(e.target.value)} value={yArgValue} />
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default PosParameterBox;
