<?php
// SUPER SIMPLE VERSION FOR BEGET
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        echo "Заполните все обязательные поля";
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Некорректный email";
        exit;
    }
    
    // Prepare email
    $to = "i.kharenko@astrostack.ru";
    $email_subject = "Заявка с AstroStack: " . ($subject ?: "Без темы");
    
    $email_body = "Имя: $name\nEmail: $email\nТелефон: " . ($phone ?: "Не указан") . "\nТема: " . ($subject ?: "Не указана") . "\n\nСообщение:\n$message";
    
    $headers = "From: i.kharenko@astrostack.ru\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "success";
    } else {
        echo "Ошибка отправки почты";
    }
    
} else {
    echo "Неверный метод запроса";
}
?>