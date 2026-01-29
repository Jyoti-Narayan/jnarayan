-- Sample Research Areas Data
-- Run this in your Supabase SQL Editor to populate research areas

INSERT INTO public.research_areas (title, description, image_url, icon_class, order_index, is_active) VALUES
(
    'Rehabilitation Robotics',
    'Developing robotic systems and devices to assist patients in regaining motor functions through targeted therapy and movement assistance.',
    NULL,
    'fas fa-robot',
    1,
    true
),
(
    'Human-Robot Interaction',
    'Designing intuitive and safe interfaces for seamless collaboration between humans and robotic systems in various applications.',
    NULL,
    'fas fa-handshake',
    2,
    true
),
(
    'Control Systems',
    'Advanced control algorithms and strategies for precise manipulation, stability, and performance optimization of robotic systems.',
    NULL,
    'fas fa-sliders-h',
    3,
    true
),
(
    'Machine Learning in Robotics',
    'Applying artificial intelligence and machine learning techniques to enhance robot perception, decision-making, and adaptability.',
    NULL,
    'fas fa-brain',
    4,
    true
),
(
    'Biomechanics',
    'Studying the mechanical principles of human movement to inform the design of assistive devices and rehabilitation protocols.',
    NULL,
    'fas fa-walking',
    5,
    true
);

-- To add images, update the image_url field with URLs from your Supabase storage:
-- UPDATE public.research_areas SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/images/rehabilitation.png' WHERE title = 'Rehabilitation Robotics';
