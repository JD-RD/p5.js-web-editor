import React, { PropTypes } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Link, browserHistory } from 'react-router';
import InlineSVG from 'react-inlinesvg';
import * as ClassroomActions from '../actions/classroom';
import * as ProjectActions from '../actions/project';
import * as ToastActions from '../actions/toast';

const leftArrow = require('../../../images/left-arrow.svg');
const exitUrl = require('../../../images/exit.svg');
const trashCan = require('../../../images/trash-can.svg');

class AssignmentSubmissions extends React.Component {
  constructor(props) {
    super(props);
    this.goBackToAssignmentList = this.goBackToAssignmentList.bind(this);
    this.closeSubmissionList = this.closeSubmissionList.bind(this);
    this.props.getSubmissions(this.props.classroom, this.props.assignment);
  }

  componentDidMount() {
    document.getElementById('submissionlist').focus();
  }

  closeSubmissionList() {
    // browserHistory.push(this.props.previousPath);
    browserHistory.push('/');
  }

  goBackToAssignmentList() {
    browserHistory.push(`/classroom/${this.props.classroom._id}`);
  }

  render() {
    const username = this.props.username !== undefined ? this.props.username : this.props.user.username;
    console.log(this.props.assignment);
    return (
      <section className="sketch-list" aria-label="submissions list" tabIndex="0" role="main" id="submissionlist">
        <header className="sketch-list__header">
          <h2 className="sketch-list__header-title">Submissions for {this.props.assignment.name} in {this.props.classroom.name}</h2>
          <button className="sketch-list__exit-button" onClick={() => { browserHistory.push('/submitsketch'); /* this.submitAssignment(); */ }}>
            Submit Assignment
          </button>
          <button className="sketch-list__exit-button" onClick={this.goBackToAssignmentList}>
            <InlineSVG src={leftArrow} alt="Go Back To Assignment List" />
          </button>
          <button className="sketch-list__exit-button" onClick={this.closeSubmissionList}>
            <InlineSVG src={exitUrl} alt="Close Submissions List Overlay" />
          </button>
        </header>
        <div className="sketches-table-container">
          <table className="sketches-table" summary="table containing all submissions in this assignment">
            <thead>
              <tr>
                <th className="sketch-list__trash-column" scope="col"></th>
                <th scope="col">Submission Name</th>
                <th scope="col">Date created</th>
                <th scope="col">Date updated</th>
              </tr>
            </thead>
            <tbody>
              {this.props.sketches.map(sketch =>
                // eslint-disable-next-line
                <tr 
                  className="sketches-table__row visibility-toggle"
                  key={sketch.id}
                  onClick={() => browserHistory.push(`/${username}/sketches/${sketch.id}`)}
                >
                  <td className="sketch-list__trash-column">
                  {(() => { // eslint-disable-line
                    if (this.props.username === this.props.user.username || this.props.username === undefined) {
                      return (
                        <button
                          className="sketch-list__trash-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${sketch.name}"?`)) {
                              // this.props.deleteProject(sketch.id);
                            }
                          }}
                        >
                          <InlineSVG src={trashCan} alt="Delete Project" />
                        </button>
                      );
                    }
                  })()}
                  </td>
                  <th scope="row"><Link to={`/${username}/sketches/${sketch.id}`}>{sketch.name}</Link></th>
                  <td>{moment(sketch.createdAt).format('MMM D, YYYY h:mm A')}</td>
                  <td>{moment(sketch.updatedAt).format('MMM D, YYYY h:mm A')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}

AssignmentSubmissions.propTypes = {
  getSubmissions: PropTypes.func.isRequired,
  // getAssignments: PropTypes.func.isRequired,
  assignment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string
  }).isRequired,
  classroom: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    assignments: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
  // getProjects: PropTypes.func.isRequired,
  sketches: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  })).isRequired,
  username: PropTypes.string,
  // previousPath: PropTypes.string.isRequired
};

AssignmentSubmissions.defaultProps = {
  classroom: {},
  username: undefined,
};

function mapStateToProps(state) {
  return {
    classroom: state.classroom,
    user: state.user,
    sketches: state.sketches,
    assignment: state.assignment
    // assignments: state.assignments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClassroomActions, ProjectActions, ToastActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentSubmissions);