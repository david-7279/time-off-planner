CREATE TABLE leave_types (
    id                SERIAL PRIMARY KEY,
    public_id         UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    name              VARCHAR(50)  NOT NULL UNIQUE,
    default_allowance INTEGER      NOT NULL CHECK (default_allowance >= 0),

    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER leave_types_set_updated_at
    BEFORE UPDATE ON leave_types
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();