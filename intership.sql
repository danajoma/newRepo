CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50)
);


CREATE TABLE Admins (
    id INT PRIMARY KEY,
    experience_years INT,
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Supervisors (
    id INT PRIMARY KEY,
    admin_id INT,
    company VARCHAR(100),
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Admins(id) ON DELETE SET NULL
);


CREATE TABLE Interns (
    id INT PRIMARY KEY,
    admin_id INT,
    university VARCHAR(100),
    major VARCHAR(100),
    attendance_ratio INT,
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Admins(id) ON DELETE SET NULL
);


CREATE TABLE Projects (
    id SERIAL PRIMARY KEY,
    created_by_admin_id INT,
    supervisor_id INT,
    title VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (created_by_admin_id) REFERENCES Admins(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES Supervisors(id) ON DELETE SET NULL
);


CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    project_id INT,
    intern_id INT,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    deadline DATE,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
    FOREIGN KEY (intern_id) REFERENCES Interns(id) ON DELETE CASCADE
);


CREATE TABLE Feedbacks (
    id SERIAL PRIMARY KEY,
    task_id INT,
    intern_id INT,
    supervisor_id INT,
    comment TEXT,
    rating INT,
    date DATE,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (intern_id) REFERENCES Interns(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES Supervisors(id) ON DELETE CASCADE
);