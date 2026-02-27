
ALTER TABLE complaints DROP CONSTRAINT complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check CHECK (status IN ('pending', 'reviewed', 'forwarded', 'resolved'));
