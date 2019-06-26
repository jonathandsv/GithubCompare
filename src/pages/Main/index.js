import React, { Component } from "react";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import moment from "moment";

import { Container, Form } from "./styles";

import CompareList from "../../components/CompareList/index";

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: "",
    repositories: []
  };

  handlerAddRepository = async e => {
    e.preventDefault();

    this.setState({ loading: true });
    try {
      const { data: repository } = await api.get(
        `/repos/${this.state.repositoryInput}`
      );

      repository.lastCommit = moment(repository.pushed_at).fromNow();
      this.setState({
        repositoryInput: "",
        repositories: [...this.state.repositories, repository],
        repositoryError: false
      });
      console.log(repository);
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form
          WithError={this.state.repositoryError}
          onSubmit={this.handlerAddRepository}
        >
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse" />
            ) : (
              "OK"
            )}
          </button>
        </Form>
        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
