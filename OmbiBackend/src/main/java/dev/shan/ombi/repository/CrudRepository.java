package dev.shan.ombi.repository;

import java.util.List;

public interface CrudRepository<T> {
	T add (T entity);
	T update (T entity);
	boolean delete (Long id);
	T get (Long id);
	List<T> getAll ();
}
