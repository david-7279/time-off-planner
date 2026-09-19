ALTER TABLE users
    ADD COLUMN team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL;

CREATE INDEX idx_users_team_id ON users (team_id);