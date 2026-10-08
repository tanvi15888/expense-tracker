package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;

@Entity
@Table(name = "users")
public class User {

    @Id
    private Integer id;

    @NotBlank(message = "Name cannot be blank")
private String name;
   @Email(message = "Please enter a valid email address")
private String emailid;
   @Positive(message = "Age must be greater than 0")
private Integer age;
    @Pattern(regexp = "\\d{10}", message = "Phone number must contain exactly 10 digits")
private String phoneNO;

@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
@Column(name = "password")
private String password;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmailid() {
        return emailid;
    }

    public void setEmailid(String emailid) {
        this.emailid = emailid;
    }


    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }


    public String getPhoneNO() {
        return phoneNO;
    }

    public void setPhoneNO(String phoneNO) {
        this.phoneNO = phoneNO;
    }
    public String getPassword() {
    return password;
}

public void setPassword(String password) {
    this.password = password;
}
}
