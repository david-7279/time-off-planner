CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE leave_requests (
    id              SERIAL PRIMARY KEY,
    public_id       UUID            NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id   INTEGER         NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,

    starts_at       DATE            NOT NULL,
    ends_at         DATE            NOT NULL,
    working_days    INTEGER         NOT NULL CHECK (working_days >= 0),
    status          request_status  NOT NULL DEFAULT 'pending',

    reviewer_id     INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    review_note     TEXT,

    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT ck_leave_requests_date_range CHECK (ends_at >= starts_at)
);

CREATE TRIGGER leave_requests_set_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_leave_requests_user_dates
    ON leave_requests (user_id, starts_at DESC);

CREATE INDEX idx_leave_requests_pending
    ON leave_requests (starts_at)
    WHERE status = 'pending';

CREATE INDEX idx_leave_requests_approved_dates
    ON leave_requests (leave_type_id, starts_at, ends_at)
    WHERE status = 'approved';