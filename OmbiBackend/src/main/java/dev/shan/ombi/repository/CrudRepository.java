package dev.shan.ombi.repository;

import java.util.List;

public interface CrudRepository<I, T> {
	T add (T entity);
	T update (T entity);
	boolean delete (I id);
	T get (I id);
	List<T> getAll ();
}
